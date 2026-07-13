#!/usr/bin/env python3
"""GPRSDLL.dll 深度逆向分析 — 无 Ghidra 时的 Python 替代方案
   目标: 确定 CommBridge 精确帧格式 (帧头/帧尾魔数, CRC范围, DTU注册流程)
"""
import os, sys, struct, pefile
from collections import defaultdict

DLL_PATH = r'D:\ai\dgiot_lite\reverse\commbridge\downloaded\GPRSDLL.dll'
PDB_FUNCTIONS = r'D:\ai\dgiot_lite\reverse\commbridge\pdb_all_functions.txt'
OUT_DIR = r'D:\ai\dgiot_lite\reverse\commbridge'

# ═══════════════════════════════════════════
# 1. PE 结构分析
# ═══════════════════════════════════════════
def analyze_pe():
    pe = pefile.PE(DLL_PATH)

    print('='*70)
    print('1. PE 基本信息')
    print('='*70)
    print(f'Machine: 0x{pe.FILE_HEADER.Machine:04X}')
    print(f'Timestamp: {pe.FILE_HEADER.TimeDateStamp}')
    print(f'Characteristics: 0x{pe.FILE_HEADER.Characteristics:04X}')
    print(f'Entry Point: 0x{pe.OPTIONAL_HEADER.AddressOfEntryPoint:08X}')
    print(f'Image Base: 0x{pe.OPTIONAL_HEADER.ImageBase:08X}')
    print(f'Number of Sections: {pe.FILE_HEADER.NumberOfSections}')

    # 段信息
    print('\n--- 段 ---')
    for section in pe.sections:
        name = section.Name.decode('utf-8', errors='ignore').rstrip('\x00')
        print(f'  {name:10s}  VA:0x{section.VirtualAddress:08X}  Size:0x{section.Misc_VirtualSize:08X}  Raw:0x{section.SizeOfRawData:08X}  '
              f'Characteristics:0x{section.Characteristics:08X}')

    # 导入 DLL
    print(f'\n--- 导入 DLL ({len(pe.DIRECTORY_ENTRY_IMPORT) if hasattr(pe, "DIRECTORY_ENTRY_IMPORT") else 0}) ---')
    if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
        for entry in pe.DIRECTORY_ENTRY_IMPORT:
            dll_name = entry.dll.decode('utf-8', errors='ignore')
            imports = [imp.name.decode('utf-8', errors='ignore') if imp.name else f'ord({imp.ordinal})'
                      for imp in entry.imports]
            print(f'  {dll_name}: {len(imports)} functions')
            for imp in imports[:15]:
                print(f'    {imp}')
            if len(imports) > 15:
                print(f'    ... ({len(imports)-15} more)')

    # 导出
    print(f'\n--- 导出 ---')
    if hasattr(pe, 'DIRECTORY_ENTRY_EXPORT'):
        exports = pe.DIRECTORY_ENTRY_EXPORT.symbols
        print(f'  导出函数数: {len(exports)}')
        for exp in exports[:30]:
            if exp.name:
                name = exp.name.decode('utf-8', errors='ignore')
                print(f'    0x{exp.address:08X}: {name}')
        if len(exports) > 30:
            print(f'    ... ({len(exports)-30} more)')

    return pe

# ═══════════════════════════════════════════
# 2. 字节模式搜索 — 寻找帧头/帧尾魔数
# ═══════════════════════════════════════════
def search_magic_patterns():
    """在DLL中搜索可能的帧头/帧尾常量"""
    with open(DLL_PATH, 'rb') as f:
        data = f.read()

    print('\n' + '='*70)
    print('2. 帧魔数模式搜索')
    print('='*70)

    # 常见帧头候选 (大端和小端)
    candidates = {
        '0xAAAA': b'\xAA\xAA',
        '0x55AA': b'\x55\xAA',
        '0xAA55': b'\xAA\x55',
        '0x7E7E': b'\x7E\x7E',
        '0xEB90': b'\xEB\x90',  # 常用起始字节
        '0xFFFF': b'\xFF\xFF',
        '0x5A5A': b'\x5A\x5A',
        '0xA5A5': b'\xA5\xA5',
        '0x68 0x68': b'\x68\x68',  # IEC 104 帧头
        '0x10 0x02': b'\x10\x02',  # DNP3
    }

    for name, pattern in candidates.items():
        positions = []
        pos = -1
        while True:
            pos = data.find(pattern, pos + 1)
            if pos == -1:
                break
            positions.append(pos)
        if positions:
            # 检查上下文
            contexts = []
            for p in positions[:3]:
                ctx = data[max(0,p-4):p+8]
                contexts.append(ctx.hex(' '))
            print(f'  {name}: {len(positions)} 次')
            for ctx in contexts[:3]:
                print(f'    @ offset 上下文: {ctx}')

    # 搜索紧接 CRC16 的帧结构模式
    # Modbus CRC16 多项式 0x8005 的常见实现
    print('\n--- CRC16 表搜索 ---')
    # CRC16 查找表通常 512 字节 (256 × uint16)
    crc_patterns = [
        b'\x00\x00\xC0\xC1',  # Modbus CRC16 表开头 (little-endian: 0x0000, 0xC0C1)
        b'\x00\x00\xC1\xC0',  # 大端版本
    ]
    for i, pat in enumerate(crc_patterns):
        pos = data.find(pat)
        if pos >= 0:
            print(f'  ✅ CRC16表 @ offset 0x{pos:X}')
            # 显示前32字节
            print(f'    前32B: {data[pos:pos+32].hex(" ")}')
        else:
            # 搜索附近模式
            for offset in range(0, len(data)-512, 256):
                chunk = data[offset:offset+4]
                if chunk == b'\x00\x00' and data[offset+2:offset+4] not in (b'\x00\x00', b'\x01\x00'):
                    # 可能是CRC表开头
                    pass

# ═══════════════════════════════════════════
# 3. 关键函数定位 (从PDB符号匹配)
# ═══════════════════════════════════════════
def find_key_functions():
    """从 PDB 符号中提取关键协议函数"""
    print('\n' + '='*70)
    print('3. 关键协议函数 (PDB 符号)')
    print('='*70)

    if not os.path.exists(PDB_FUNCTIONS):
        print(f'  PDB 文件不存在: {PDB_FUNCTIONS}')
        return

    with open(PDB_FUNCTIONS, 'r', encoding='utf-8', errors='ignore') as f:
        symbols = f.read()

    # 搜索关键函数
    key_funcs = [
        'SendData', 'RecvData', 'FormatData', 'ParseFrame',
        'CRegister', 'Login', 'Logout',
        'CRC', 'CheckSum', 'CheckFrame',
        'BuildFrame', 'PackData', 'UnpackData',
        'OnReceiveID', 'OnReceive', 'CB_On',
        'ReadData', 'WriteData',
        'ProcessBuffer', 'HandlePacket',
        'HeartBeat', 'KeepAlive',
    ]

    found = defaultdict(list)
    for func in key_funcs:
        for line in symbols.split('\n'):
            if func.lower() in line.lower():
                found[func].append(line.strip())

    for func, lines in sorted(found.items()):
        print(f'\n  [{func}] ({len(lines)} matches)')
        for line in lines[:5]:
            # 清理garbled字符
            clean = ''.join(c if ord(c) < 128 or c in '::_~ ' else '?' for c in line)
            print(f'    {clean[:120]}')

# ═══════════════════════════════════════════
# 4. 寻找 DTU 注册协议字符串
# ═══════════════════════════════════════════
def search_protocol_strings():
    import re
    with open(DLL_PATH, 'rb') as f:
        data = f.read()

    print('\n' + '='*70)
    print('4. 协议相关字符串搜索')
    print('='*70)

    # 提取所有可能的字符串
    strings = []
    i = 0
    while i < len(data):
        if 0x20 <= data[i] <= 0x7E:
            end = i
            while end < len(data) and 0x20 <= data[end] <= 0x7E:
                end += 1
            if end - i >= 3:
                s = data[i:end].decode('ascii', errors='ignore')
                strings.append((i, s))
            i = end
        else:
            i += 1

    # 过滤协议相关
    protocol_kw = [
        'ID', 'REG', 'LOGIN', 'LOGOUT', 'HEART', 'BYE', 'PASS',
        'PORT', 'AT+', 'IMEI', 'DTU', 'MODBUS', 'CRC', 'SOCK',
        'SEND', 'RECV', 'FRAME', 'HEAD', 'TAIL', 'SYNC', 'ACK',
        'NAK', 'DATA', 'TIME', 'KEEP', 'ALIVE', '0x'
    ]

    interesting = []
    for offset, s in strings:
        upper = s.upper()
        for kw in protocol_kw:
            if kw in upper:
                interesting.append((offset, s))
                break

    print(f'总字符串: {len(strings)}')
    print(f'协议相关: {len(interesting)}')

    for offset, s in interesting[:50]:
        print(f'  0x{offset:08X}: {s}')

# ═══════════════════════════════════════════
# 5. 代码段反汇编 (关键区域)
# ═══════════════════════════════════════════
def disassemble_code_section():
    """反汇编 .text 段的关键区域"""
    pe = pefile.PE(DLL_PATH)

    # 找到 .text 段
    text_section = None
    for section in pe.sections:
        name = section.Name.decode('utf-8', errors='ignore').rstrip('\x00')
        if name == '.text':
            text_section = section
            break

    if not text_section:
        print('未找到 .text 段')
        return

    data = text_section.get_data()
    va = text_section.VirtualAddress

    print('\n' + '='*70)
    print(f'5. .text 段分析 (VA:0x{va:08X}, 大小:{len(data)})')
    print('='*70)

    # 搜索函数序言 (push ebp; mov ebp, esp)
    prologue = b'\x55\x8B\xEC'
    prologue_count = data.count(prologue)
    print(f'函数序言 (push ebp; mov ebp,esp): {prologue_count} 个')

    # 搜索返回指令附近的常数 (帧头/帧尾可能作为立即数)
    print('\n--- 搜索 0xAAAA/0x55AA 作为立即数 ---')
    # 在代码段搜索 mov ax, 0xAAAA 等模式
    # B8 AA AA = mov eax, 0x0000AAAA
    # 66 B8 AA AA = mov ax, 0xAAAA
    imm_patterns = [
        (b'\xB8\xAA\xAA\x00\x00', 'mov eax, 0xAAAA'),
        (b'\x66\xB8\xAA\xAA', 'mov ax, 0xAAAA'),
        (b'\xB8\x55\xAA\x00\x00', 'mov eax, 0x55AA'),
        (b'\x66\xB8\x55\xAA', 'mov ax, 0x55AA'),
        (b'\xBA\xAA\xAA\x00\x00', 'mov edx, 0xAAAA'),
        (b'\xB9\xAA\xAA\x00\x00', 'mov ecx, 0xAAAA'),
    ]

    for pattern, desc in imm_patterns:
        count = data.count(pattern)
        if count > 0:
            # 找到位置
            pos = data.find(pattern)
            ctx_before = data[max(0,pos-16):pos]
            ctx_after = data[pos+len(pattern):pos+len(pattern)+16]
            print(f'  ✅ {desc}: {count}次 @ 0x{pos:X}')
            print(f'     前: {ctx_before.hex(" ")}')
            print(f'     后: {ctx_after.hex(" ")}')

    # 搜索 switch-case 跳转表 (帧类型分发)
    print('\n--- 搜索 switch 跳转表 (帧类型分发) ---')
    # switch 特征: FF 24 85 XX XX XX XX (jmp [eax*4+offset])
    switch_pattern = b'\xFF\x24\x85'
    count = data.count(switch_pattern)
    print(f'  switch跳转: {count} 个')

    # 搜索 cmp + jxx 序列 (帧类型比较)
    # 83 F8 XX = cmp eax, XX (帧类型判断)
    cmp_pattern = b'\x83\xF8'
    positions = []
    pos = -1
    while True:
        pos = data.find(cmp_pattern, pos + 1)
        if pos == -1:
            break
        if pos + 2 < len(data):
            cmp_value = data[pos + 2]
            if cmp_value <= 0x10:  # 帧类型范围 0x01-0x10
                positions.append((pos, cmp_value))

    print(f'  cmp eax, small_imm (帧类型?): {len(positions)} 个')
    for pos, val in positions[:10]:
        ctx = data[max(0,pos-4):pos+8]
        print(f'    0x{pos:X}: cmp eax, 0x{val:02X}  [{ctx.hex(" ")}]')

# ═══════════════════════════════════════════
# 6. 生成报告
# ═══════════════════════════════════════════
def generate_report(results):
    pass

if __name__ == '__main__':
    pe = analyze_pe()
    search_magic_patterns()
    find_key_functions()
    search_protocol_strings()
    disassemble_code_section()

    print('\n' + '='*70)
    print('分析完成')
    print('='*70)
