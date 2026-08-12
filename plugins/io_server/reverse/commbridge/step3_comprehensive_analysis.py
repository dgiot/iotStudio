"""
Step 3: Comprehensive static analysis of LegacyComm.exe
- PE structure analysis (imports, sections, resources)
- Strings extraction
- RTTI class hierarchy discovery
- Network API identification
"""
import pefile
import os, re, struct, json
from collections import defaultdict

LOCAL_DIR = "D:/ai/dgiot_lite/reverse/commbridge/downloaded"
OUTPUT_DIR = "D:/ai/dgiot_lite/reverse/commbridge"

def analyze_pe(filepath):
    """Analyze PE structure of LegacyComm.exe."""
    results = {
        'sections': [],
        'imports': {},
        'exports': [],
        'resources': [],
        'rtti_classes': [],
        'all_strings': [],
        'network_apis': [],
        'modbus_strings': [],
        'protocol_strings': [],
        'config_strings': [],
        'dtu_strings': [],
        'oracle_strings': [],
        'peculiar_patterns': [],
    }

    try:
        pe = pefile.PE(filepath)
    except Exception as e:
        print(f"  Error opening PE: {e}")
        return results

    # Sections
    print("\n[PE Sections]")
    for section in pe.sections:
        name = section.Name.decode('utf-8', errors='ignore').rstrip('\x00')
        info = {
            'name': name,
            'virtual_address': hex(section.VirtualAddress),
            'virtual_size': section.Misc_VirtualSize,
            'raw_size': section.SizeOfRawData,
            'characteristics': hex(section.Characteristics),
        }
        results['sections'].append(info)
        entropy = section.get_entropy()
        print(f"  {name}: VA={info['virtual_address']}, VSz={info['virtual_size']}, "
              f"RawSz={info['raw_size']}, Entropy={entropy:.2f}")

    # Imports
    print("\n[Import Table - Network related]")
    network_dlls = ['ws2_32', 'wsock32', 'wininet', 'winhttp', 'mswsock',
                    'wshtcpip', 'iphlpapi', 'netapi32', 'dnsapi', 'dhcpcsvc',
                    'rpcrt4', 'secur32', 'schannel', 'crypt32', 'ncrypt']

    network_apis = []
    all_imports = defaultdict(list)

    if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
        for entry in pe.DIRECTORY_ENTRY_IMPORT:
            dll_name = entry.dll.decode('utf-8', 'ignore').lower()
            for imp in entry.imports:
                func_name = imp.name.decode('utf-8', 'ignore') if imp.name else f"ord_{imp.ordinal}"
                all_imports[dll_name].append(func_name)

                is_network = any(nd in dll_name for nd in network_dlls)
                if is_network:
                    network_apis.append(f"{dll_name}.{func_name}")

    results['imports'] = dict(all_imports)

    # Print network APIs
    for dll, funcs in sorted(all_imports.items()):
        if any(nd in dll for nd in network_dlls):
            print(f"\n  [{dll}]")
            for f in sorted(funcs):
                print(f"    {f}")

    # Exports
    if hasattr(pe, 'DIRECTORY_ENTRY_EXPORT'):
        for exp in pe.DIRECTORY_ENTRY_EXPORT.symbols:
            if exp.name:
                results['exports'].append(exp.name.decode('utf-8', 'ignore'))

    # RTTI: search for .?AV patterns (MSVC RTTI type descriptors)
    print("\n[RTTI Type Descriptors]")
    rtti_data = b''
    for section in pe.sections:
        if b'.rdata' in section.Name or b'.data' in section.Name:
            rtti_data += section.get_data()

    # Find all MSVC RTTI type descriptor names
    rtti_pattern = re.compile(b'\.\?AV([A-Za-z_][A-Za-z0-9_<>@]*?)@@')
    rtti_classes = set()
    for m in rtti_pattern.finditer(rtti_data):
        try:
            cls = m.group(1).decode('ascii', errors='ignore')
            # Clean up MSVC mangling artifacts
            cls = cls.replace('@', '::')
            rtti_classes.add(cls)
        except:
            pass

    # Also search ASCII versions
    for m in re.finditer(rb'\.\?AV(\w+)@@', rtti_data):
        try:
            cls = m.group(1).decode('ascii', errors='ignore')
            if 3 < len(cls) < 100:
                rtti_classes.add(cls)
        except:
            pass

    results['rtti_classes'] = sorted(rtti_classes)
    print(f"  Found {len(rtti_classes)} RTTI classes:")
    for c in sorted(rtti_classes):
        print(f"    {c}")

    return results

def extract_strings_binary(filepath, min_len=4):
    """Extract all ASCII/UTF-8 strings from binary."""
    strings = {
        'all': [],
        'modbus': [],
        'protocol': [],
        'config': [],
        'dtu': [],
        'oracle': [],
        'network': [],
        'gprs': [],
        'error': [],
        'format': [],
    }

    try:
        with open(filepath, 'rb') as f:
            data = f.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return strings

    # Extract strings
    current = b''
    for byte in data:
        if 32 <= byte < 127:
            current += bytes([byte])
        else:
            if len(current) >= min_len:
                strings['all'].append(current.decode('ascii', errors='ignore'))
            current = b''
    if len(current) >= min_len:
        strings['all'].append(current.decode('ascii', errors='ignore'))

    # Categorize
    modbus_kw = ['modbus', 'rtu', 'mbap', 'pdu', 'slave', 'coil', 'register',
                 'holding', 'input', 'discrete', 'function code', 'exception',
                 'crc', 'crc16', 'lrc', 'serial', 'com', 'baud', 'parity',
                 'databit', 'stopbit', 'rts', 'dtr']
    protocol_kw = ['frame', 'header', 'packet', 'protocol', 'parser', 'payload',
                   'command', 'response', 'request', 'reply', 'ack', 'nak',
                   'heartbeat', 'keepalive', 'session', 'handshake', 'timeout']
    config_kw = ['ini', 'cfg', 'xml', 'config', 'setting', 'parameter', 'profile',
                 'registry', 'regkey', 'device', 'channel']
    dtu_kw = ['dtu', 'gprs', 'register', 'login', 'auth', 'imei', 'imsi',
              'terminal', 'deviceid', 'serial', 'connect']
    oracle_kw = ['oracle', 'oci', 'sql', 'database', 'select', 'insert', 'update',
                 'delete', 'from', 'where', 'connection', 'query']
    network_kw = ['socket', 'tcp', 'udp', 'connect', 'listen', 'bind', 'accept',
                  'send', 'recv', 'wsa', 'overlap', 'iocp', 'i/o', 'ioctl']
    gprs_kw = ['gprs', 'at+', 'atd', 'at+cg', 'gsm', 'cdma', 'sms', 'signal']
    error_kw = ['error', 'fail', 'exception', 'invalid', 'unknown', 'cannot',
                'unable', 'denied', 'refused', 'timeout']
    format_kw = ['%s', '%d', '%x', '%02x', '%04x', 'sprintf', 'printf', 'wsprintf']

    for s in strings['all']:
        s_lower = s.lower()
        for kw in modbus_kw:
            if kw in s_lower:
                strings['modbus'].append(s)
                break
        for kw in protocol_kw:
            if kw in s_lower:
                strings['protocol'].append(s)
                break
        for kw in config_kw:
            if kw in s_lower:
                strings['config'].append(s)
                break
        for kw in dtu_kw:
            if kw in s_lower:
                strings['dtu'].append(s)
                break
        for kw in oracle_kw:
            if kw in s_lower:
                strings['oracle'].append(s)
                break
        for kw in network_kw:
            if kw in s_lower:
                strings['network'].append(s)
                break
        for kw in gprs_kw:
            if kw in s_lower:
                strings['gprs'].append(s)
                break

    return strings

def main():
    print("=" * 60)
    print("Step 3: Comprehensive Static Analysis of LegacyComm.exe")
    print("=" * 60)

    exe_path = os.path.join(LOCAL_DIR, "LegacyComm.exe")
    if not os.path.exists(exe_path):
        # Try alt name
        for f in os.listdir(LOCAL_DIR):
            if 'LegacyComm' in f and f.endswith('.exe'):
                exe_path = os.path.join(LOCAL_DIR, f)
                break

    print(f"\nAnalyzing: {exe_path}")
    print(f"File size: {os.path.getsize(exe_path):,} bytes")

    # 1. PE Analysis
    print("\n" + "-" * 60)
    print("PE STRUCTURE ANALYSIS")
    print("-" * 60)
    pe_results = analyze_pe(exe_path)

    # 2. Extract and categorize strings
    print("\n" + "-" * 60)
    print("STRINGS EXTRACTION AND CATEGORIZATION")
    print("-" * 60)
    strings = extract_strings_binary(exe_path)

    for category, items in strings.items():
        if category == 'all':
            continue
        if items:
            print(f"\n  [{category}] {len(items)} strings:")
            for s in sorted(set(items))[:30]:
                s_clean = s.replace('\x00', '')
                if len(s_clean) >= 3:
                    print(f"    {s_clean}")
            if len(set(items)) > 30:
                print(f"    ... and {len(set(items)) - 30} more")

    # 3. Save all strings
    strings_outpath = os.path.join(OUTPUT_DIR, "commbridge_strings_all.txt")
    with open(strings_outpath, 'w', encoding='utf-8') as f:
        for s in strings['all']:
            f.write(s + '\n')
    print(f"\n  All strings saved to: {strings_outpath}")

    # 4. Save PE analysis
    pe_outpath = os.path.join(OUTPUT_DIR, "commbridge_pe_analysis.json")
    with open(pe_outpath, 'w', encoding='utf-8') as f:
        json.dump(pe_results, f, indent=2, ensure_ascii=False, default=str)
    print(f"  PE analysis saved to: {pe_outpath}")

    # 5. Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  PE Sections: {len(pe_results['sections'])}")
    print(f"  Import DLLs: {len(pe_results['imports'])}")
    print(f"  RTTI Classes: {len(pe_results['rtti_classes'])}")
    print(f"  Total Strings: {len(strings['all'])}")
    print(f"  Network API calls: {len(pe_results['network_apis'])}")

    for cat in ['modbus', 'protocol', 'dtu', 'gprs', 'config', 'oracle']:
        print(f"  Categorized [{cat}]: {len(strings[cat])}")

    # Print all network APIs
    if pe_results['network_apis']:
        print(f"\n  Network API calls ({len(pe_results['network_apis'])}):")
        for api in sorted(pe_results['network_apis']):
            print(f"    {api}")

    # Print all imports
    print(f"\n  All imported DLLs:")
    for dll in sorted(pe_results['imports'].keys()):
        print(f"    {dll}: {len(pe_results['imports'][dll])} functions")

    print("\nStep 3 complete!")

if __name__ == '__main__':
    main()
