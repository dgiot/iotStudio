#!/usr/bin/env python3
"""GPRSDLL.dll 深度分析 — 定位帧格式常量"""
import os, struct, pefile

DLL_PATH = r'D:\ai\dgiot_lite\reverse\commbridge\downloaded\GPRSDLL.dll'

pe = pefile.PE(DLL_PATH)

# 获取 .text 段数据
text_section = None
for section in pe.sections:
    if section.Name.decode('utf-8').rstrip('\x00') == '.text':
        text_section = section
        break

data = text_section.get_data()
text_va = text_section.VirtualAddress
text_size = len(data)
print(f'.text段: VA=0x{text_va:08X}, Size=0x{text_size:X}')

# .rdata 段 (只读数据 — 包含字符串和常量)
rdata_section = None
for section in pe.sections:
    if section.Name.decode('utf-8').rstrip('\x00') == '.rdata':
        rdata_section = section
        break
rdata_data = rdata_section.get_data()
rdata_va = rdata_section.VirtualAddress

# ═══════════════════════════════════════════
# 1. 定位关键函数 DSGetNextData (export #3)
# ═══════════════════════════════════════════
DSGetNextData_RVA = 0x103C  # from exports
DSGetNextData_offset = DSGetNextData_RVA  # RVA = offset for .text

print('\n' + '='*70)
print(f'1. DSGetNextData @ RVA 0x{DSGetNextData_RVA:X}')
print('='*70)

# 读取函数体 (前200字节)
func_start = DSGetNextData_offset
func_bytes = data[func_start:func_start+300]
print(f'函数体前300字节:')
for i in range(0, 300, 16):
    chunk = func_bytes[i:i+16]
    hex_str = ' '.join(f'{b:02X}' for b in chunk)
    ascii_str = ''.join(chr(b) if 0x20 <= b < 0x7F else '.' for b in chunk)
    print(f'  +{i:3d}: {hex_str:48s} {ascii_str}')

# ═══════════════════════════════════════════
# 2. 定位 DSSendData (export #4)
# ═══════════════════════════════════════════
DSSendData_RVA = 0x1131
print('\n' + '='*70)
print(f'2. DSSendData @ RVA 0x{DSSendData_RVA:X}')
print('='*70)
func_bytes = data[DSSendData_RVA:DSSendData_RVA+200]
for i in range(0, 200, 16):
    chunk = func_bytes[i:i+16]
    hex_str = ' '.join(f'{b:02X}' for b in chunk)
    ascii_str = ''.join(chr(b) if 0x20 <= b < 0x7F else '.' for b in chunk)
    print(f'  +{i:3d}: {hex_str:48s} {ascii_str}')

# ═══════════════════════════════════════════
# 3. 搜索所有 call 指令，看 DSGetNextData 的调用链
# ═══════════════════════════════════════════
print('\n' + '='*70)
print('3. 搜索引用 "ENTER GET NEXT DATA" 字符串的函数')
print('='*70)

# 在 .rdata 中找字符串地址
for stage in range(1, 7):
    target = f'ENTER GET NEXT DATA {stage}!'.encode('ascii')
    pos = rdata_data.find(target)
    if pos >= 0:
        str_va = rdata_va + pos
        print(f'  Stage {stage}: "ENTER GET NEXT DATA {stage}!" @ RVA 0x{str_va:08X}')

        # 在 .text 找对这个字符串的引用 (push offset xxx)
        # push 指令: 68 XX XX XX XX (push imm32)
        ref_bytes = struct.pack('<I', str_va)
        ref_count = data.count(ref_bytes)
        if ref_count > 0:
            ref_pos = data.find(ref_bytes)
            print(f'    被 {ref_count} 个位置引用, 首次 @ text+0x{ref_pos:X}')
            # 显示周围的代码
            ctx = data[max(0,ref_pos-10):ref_pos+20]
            print(f'    上下文: {ctx.hex(" ")}')

# ═══════════════════════════════════════════
# 4. 搜索帧头/帧尾常量的 CMP 指令
# ═══════════════════════════════════════════
print('\n' + '='*70)
print('4. 搜索帧魔数比较指令 (cmp ax/word ptr, 0xAAAA/0x55AA)')
print('='*70)

# 搜索 66 3D AA AA (cmp ax, 0xAAAA)
# 搜索 66 81 F8 AA AA (cmp ax, 0xAAAA)
# 搜索 3D AA AA 00 00 (cmp eax, 0x0000AAAA)
# 搜索 81 F8 AA AA 00 00 (cmp eax, 0x0000AAAA)
# 搜索 81 7D XX AA AA (cmp word ptr [ebp+XX], 0xAAAA) — 局部变量比较!

cmp_patterns = [
    (b'\x66\x3D\xAA\xAA', 'cmp ax, 0xAAAA'),
    (b'\x66\x3D\x55\xAA', 'cmp ax, 0x55AA'),
    (b'\x66\x81\xF8\xAA\xAA', 'cmp ax, 0xAAAA (ext)'),
    (b'\x66\x81\xF8\x55\xAA', 'cmp ax, 0x55AA (ext)'),
    (b'\x3D\xAA\xAA\x00\x00', 'cmp eax, 0x0000AAAA'),
    (b'\x3D\x55\xAA\x00\x00', 'cmp eax, 0x000055AA'),
    (b'\x81\xF8\xAA\xAA\x00\x00', 'cmp eax, 0x0000AAAA (ext)'),
    (b'\x81\xF8\x55\xAA\x00\x00', 'cmp eax, 0x000055AA (ext)'),
]

for pattern, desc in cmp_patterns:
    count = data.count(pattern)
    if count > 0:
        pos = data.find(pattern)
        ctx = data[max(0,pos-8):pos+len(pattern)+12]
        print(f'  ✅ {desc}: {count}次 (首次 @ text+0x{pos:X})')
        print(f'     上下文: {ctx.hex(" ")}')

# 搜索 MOV 立即数 AX, 0xAAAA 模式
print('\n--- MOV 立即数 ---')
mov_patterns = [
    (b'\x66\xB8\xAA\xAA', 'mov ax, 0xAAAA'),
    (b'\x66\xB8\x55\xAA', 'mov ax, 0x55AA'),
    (b'\x66\xBA\xAA\xAA', 'mov dx, 0xAAAA'),
    (b'\x66\xBA\x55\xAA', 'mov dx, 0x55AA'),
    (b'\xB8\xAA\xAA\x00\x00', 'mov eax, 0x0000AAAA'),
    (b'\xB8\x55\xAA\x00\x00', 'mov eax, 0x000055AA'),
]

for pattern, desc in mov_patterns:
    count = data.count(pattern)
    if count > 0:
        pos = data.find(pattern)
        ctx = data[max(0,pos-8):pos+len(pattern)+12]
        print(f'  ✅ {desc}: {count}次 @ text+0x{pos:X}')
        print(f'     上下文: {ctx.hex(" ")}')

# ═══════════════════════════════════════════
# 5. 搜索 CRC16 计算函数
# ═══════════════════════════════════════════
print('\n' + '='*70)
print('5. 搜索 CRC16 计算 (XOR 0xA001 / 0x8005 shift)')
print('='*70)

# Modbus CRC16: CRC = (CRC >> 1) ^ ((CRC & 1) ? 0xA001 : 0)
# 搜索 XOR 指令中包含 0xA001
# 81 F0 01 A0 (xor eax, 0x0000A001)
xor_a001 = b'\x01\xA0'  # 在指令中搜索 A001 模式
# 更具体的: 35 01 A0 00 00 (xor eax, 0xA001)
# 或 81 F0 01 A0 00 00 (xor eax, 0x0000A001)
crc_xor_patterns = [
    (b'\x35\x01\xA0\x00\x00', 'xor eax, 0xA001'),
    (b'\x81\xF0\x01\xA0\x00\x00', 'xor eax, 0xA001 (ext)'),
    (b'\x66\x35\x01\xA0', 'xor ax, 0xA001'),
    (b'\x35\x01\x80\x00\x00', 'xor eax, 0x8001'),
]

for pattern, desc in crc_xor_patterns:
    count = data.count(pattern)
    if count > 0:
        pos = data.find(pattern)
        ctx = data[max(0,pos-16):pos+20]
        print(f'  ✅ {desc}: {count}次 @ text+0x{pos:X}')
        print(f'     上下文: {ctx.hex(" ")}')

# 搜索 CRC 移位计算 (shr ax, 1 / shr eax, 1 后面的 XOR)
# D1 E8 (shr eax, 1)
shr_count = data.count(b'\xD1\xE8')
print(f'\n  shr eax,1 出现次数: {shr_count}')

# ═══════════════════════════════════════════
# 6. 搜索 DTU 注册相关逻辑
# ═══════════════════════════════════════════
print('\n' + '='*70)
print('6. 搜索 DTU ID / IMEI 相关代码模式')
print('='*70)

# IMEI 是 15 位数字 (0x0F 即 15)
# 搜索 cmp eax/ecx, 0x0F 或 cmp byte ptr [xxx], 0x0F
cmp_15 = data.count(b'\x83\xF8\x0F')  # cmp eax, 15
cmp_15_2 = data.count(b'\x83\xF9\x0F')  # cmp ecx, 15
print(f'  cmp eax, 15 (IMEI长度?): {cmp_15} 次')
print(f'  cmp ecx, 15 (IMEI长度?): {cmp_15_2} 次')

# 搜索比较长度为 8/12/15 的模式 (常见 DTU ID 长度)
for length in [8, 12, 15, 16, 20]:
    pat = bytes([0x83, 0xF8, length])  # cmp eax, N
    cnt = data.count(pat)
    if cnt > 0:
        pos = data.find(pat)
        ctx = data[max(0,pos-4):pos+10]
        print(f'  cmp eax, {length}: {cnt}次 @ text+0x{pos:X} ctx:{ctx.hex(" ")}')

# ═══════════════════════════════════════════
# 7. 搜索帧头帧尾的 PUSH 模式 (函数参数)
# ═══════════════════════════════════════════
print('\n' + '='*70)
print('7. 搜索可能的帧结构字段偏移')
print('='*70)

# 通过搜索 add/sub 偏移来推断结构体大小
# 搜索 add esp/ebp 后带固定偏移的指令 (栈帧清理, 结构体偏移)
push_offsets = {}
for offset in range(len(data)-3):
    # 搜索 [ebp+N] 引用 (mov/cmp byte/word/dword ptr [ebp+XX])
    if data[offset] in (0x8B, 0x89, 0x66, 0x0F) and offset+3 < len(data):
        # 追踪常见的字段偏移
        pass

# ═══════════════════════════════════════════
# 8. 生成最终报告
# ═══════════════════════════════════════════
print('\n' + '='*70)
print('8. 分析总结')
print('='*70)

# 统计 .text 段中使用的内存比较常量
from collections import Counter
const_compares = Counter()
for offset in range(len(data)-3):
    if data[offset:offset+2] == b'\x81\xF8':  # cmp eax, imm32
        if offset + 6 <= len(data):
            imm = struct.unpack('<I', data[offset+2:offset+6])[0]
            if imm < 0x10000:  # 只关注小于64K的常量
                const_compares[hex(imm)] += 1
    elif data[offset:offset+2] == b'\x83\xF8':  # cmp eax, imm8
        if offset + 3 <= len(data):
            const_compares[data[offset+2]] += 1

print(f'最常见的比较常量 (可能是帧类型/状态码):')
for val, cnt in const_compares.most_common(20):
    if isinstance(val, int) and val <= 0x20:
        print(f'  0x{val:02X} ({val}): {cnt}次')
    elif isinstance(val, str):
        print(f'  {val}: {cnt}次')
