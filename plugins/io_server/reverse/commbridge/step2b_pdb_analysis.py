"""
Step 2b: PDB Symbol Analysis - focused extraction of class names & functions
"""
import os, re, json

LOCAL_DIR = "D:/ai/dgiot_lite/reverse/commbridge/downloaded"
OUTPUT_DIR = "D:/ai/dgiot_lite/reverse/commbridge"

# Override stdout encoding for printing
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def extract_pdb_symbols(pdb_path):
    """Extract symbol-like strings from PDB file with focus on C++ class/function names."""
    symbols = {
        'all_classes': set(),
        'all_functions': set(),
        'network_protocol': set(),
        'dtu_gprs': set(),
        'config_io': set(),
        'thread_pool': set(),
        'oracle_db': set(),
        'mfc_related': set(),
    }

    try:
        with open(pdb_path, 'rb') as f:
            data = f.read()
    except Exception as e:
        print(f"  Error reading PDB: {e}")
        return symbols

    text = data.decode('latin-1', errors='replace')

    # MSVC name decorations in PDB
    # .?AVClassName@@  - class names
    class_pat = re.compile(r'\.\?AV(\w+)@@')
    for m in class_pat.finditer(text):
        cls = m.group(1)
        if 2 < len(cls) < 80 and not re.match(r'^[0-9]+$', cls):
            symbols['all_classes'].add(cls)

    # .?AUStructName@@ - struct/union names
    struct_pat = re.compile(r'\.\?AU(\w+)@@')
    for m in struct_pat.finditer(text):
        cls = m.group(1)
        if 2 < len(cls) < 80:
            symbols['all_classes'].add(cls)

    # De-mangled function names - patterns like ?functionname@@
    func_pat = re.compile(r'\?(\w+)@@[YH]')
    for m in func_pat.finditer(text):
        fn = m.group(1)
        if 2 < len(fn) < 60:
            symbols['all_functions'].add(fn)

    # Names with :: pattern (namespaces/class members)
    scope_pat = re.compile(r'(\w+::\w+)')
    for m in scope_pat.finditer(text):
        name = m.group(1)
        if len(name) > 3:
            if ':' not in name.replace('::', ''):
                symbols['all_functions'].add(name)

    # Undecorated identifiers from PDB string table
    # Many function names appear plain in the PDB
    idents = set()
    ident_pat = re.compile(r'[A-Za-z_]\w{4,50}')
    for m in ident_pat.finditer(text):
        ident = m.group()
        # Skip hex numbers, common C++ keywords
        if re.match(r'^[0-9A-Fa-f]{8,}$', ident):
            continue
        if ident.lower() in ('this', 'class', 'struct', 'void', 'int', 'const', 'static',
                             'virtual', 'public', 'private', 'protected', 'inline', 'return',
                             'using', 'namespace', 'string', 'vector', 'map', 'set', 'list',
                             'auto', 'sizeof', 'typedef', 'enum', 'unsigned', 'signed'):
            continue
        # Must have at least one letter among first 4 chars
        if not any(c.isalpha() for c in ident[:4]):
            continue
        idents.add(ident)

    # Add to functions
    symbols['all_functions'].update(idents)

    return symbols

def categorize_symbols(symbols):
    """Categorize symbols into meaningful groups."""
    # Merge all names
    all_names = symbols['all_classes'] | symbols['all_functions']

    categories = {
        'network': set(),
        'dtu': set(),
        'protocol': set(),
        'config': set(),
        'thread': set(),
        'oracle': set(),
        'mfc': set(),
        'modbus': set(),
        'serial': set(),
        'io': set(),
        'timer': set(),
        'gprs': set(),
    }

    # Keywords for categorization
    kw_map = {
        'network': ['send', 'recv', 'socket', 'tcp', 'udp', 'connect', 'listen', 'bind',
                    'accept', 'wsa', 'iocp', 'overlap', 'readfile', 'writefile', 'transmit',
                    'ipaddr', 'endpoint', 'ntohs', 'htons', 'select', 'winsock', 'ws2',
                    'onaccept', 'ondisconnect', 'onsend', 'onreceive', 'ondata'],
        'dtu': ['dtu', 'gprs', 'register', 'login', 'auth', 'heartbeat', 'keepalive',
                'imei', 'imsi', 'terminal', 'handshake', 'deviceid', 'sunway', 'weipu',
                'hongdian', 'fourfaith', 'inhand', 'landi', 'fengshi', 'etung', 'caomao',
                'baihua', 'huayuan', 'data86', 'data6211', 'hjt212'],
        'protocol': ['modbus', 'rtu', 'mbap', 'pdu', 'frame', 'header', 'packet', 'crc',
                     'checksum', 'parser', 'encode', 'decode', 'serialize', 'protocol',
                     'command', 'response', 'request', 'reply', 'function', 'coil',
                     'register', 'holding', 'discrete', 'slave', 'station', 'address',
                     'payload', 'datagram'],
        'config': ['config', 'ini', 'cfg', 'xml', 'setting', 'profile', 'device', 'channel',
                   'readsetting', 'writesetting', 'getprivate', 'writeprivate',
                   'loadconfig', 'saveconfig', 'readini', 'writeini', 'parambuff'],
        'thread': ['thread', 'mutex', 'critical', 'semaphore', 'event', 'wait',
                   'signal', 'lock', 'synchronize', 'createthread', 'beginthread',
                   'pool', 'worker', 'callback', 'apc'],
        'oracle': ['oracle', 'oci', 'sql', 'database', 'connection', 'query', 'select',
                   'insert', 'update', 'delete', 'ado', 'oledb', 'odbc', 'dbcomm'],
        'mfc': ['afx', 'cwnd', 'cwin', 'cdoc', 'cview', 'cframe', 'cdialog', 'cobject',
                'cstring', 'cfile', 'clist', 'carray', 'cmap', 'cptr', 'ccmd',
                'cscroll', 'cspin', 'cbutton', 'cedit', 'ccombo', 'clistbox'],
        'serial': ['serial', 'com', 'rs232', 'rs485', 'baud', 'parity', 'databit',
                   'stopbit', 'rts', 'dtr', 'comm', 'serialport'],
        'io': ['io', 'channel', 'device', 'driver', 'port', 'input', 'output',
               'analog', 'digital', 'signal', 'sensor', 'transducer', 'plc', 'rtu'],
        'timer': ['timer', 'timeout', 'interval', 'schedule', 'ontimer', 'settimer',
                  'killtimer', 'cb_timer'],
        'gprs': ['gprs', 'cdma', 'gsm', 'lte', '4g', '5g', 'modem', 'at+cg', 'atd',
                 'signal', 'rssi', 'sim', 'apn'],
    }

    for name in all_names:
        nl = name.lower()
        for cat, keywords in kw_map.items():
            for kw in keywords:
                if kw.lower() in nl:
                    categories[cat].add(name)
                    break

    return categories

def main():
    print("=" * 60)
    print("Step 2b: PDB Symbol Extraction & Categorization")
    print("=" * 60)

    pdb_path = os.path.join(LOCAL_DIR, "CommBridge.pdb")
    if not os.path.exists(pdb_path):
        print(f"  PDB not found: {pdb_path}")
        return

    print(f"\n  PDB: {os.path.getsize(pdb_path):,} bytes")
    symbols = extract_pdb_symbols(pdb_path)

    # Print raw counts
    print(f"\n  Raw symbol counts:")
    print(f"    Classes found: {len(symbols['all_classes'])}")
    print(f"    Functions/methods found: {len(symbols['all_functions'])}")

    # Categorize
    categories = categorize_symbols(symbols)

    print(f"\n{'='*60}")
    print(f"CATEGORIZED SYMBOLS (by relevance)")
    print(f"{'='*60}")

    for cat in ['network', 'dtu', 'protocol', 'gprs', 'serial', 'io',
                'config', 'thread', 'oracle', 'mfc', 'timer']:
        items = sorted(categories[cat])
        if items:
            print(f"\n  [{cat.upper()}] {len(items)} symbols:")
            for item in items[:50]:
                # Decode if needed
                try:
                    print(f"    {item}")
                except:
                    print(f"    {item.encode('ascii', errors='replace').decode('ascii')}")
            if len(items) > 50:
                print(f"    ... and {len(items) - 50} more")

    # Print all classes (sorted by length)
    print(f"\n{'='*60}")
    print(f"ALL CLASS NAMES ({len(symbols['all_classes'])} total)")
    print(f"{'='*60}")
    class_list = sorted(symbols['all_classes'], key=lambda x: (len(x), x))
    for cls in class_list:
        try:
            print(f"  {cls}")
        except:
            print(f"  {cls.encode('ascii', errors='replace').decode('ascii')}")

    # Save all symbols
    outpath = os.path.join(OUTPUT_DIR, "pdb_all_classes.txt")
    with open(outpath, 'w', encoding='utf-8', errors='replace') as f:
        for cls in sorted(symbols['all_classes']):
            f.write(cls + '\n')
    print(f"\n  Classes saved to: {outpath}")

    outpath2 = os.path.join(OUTPUT_DIR, "pdb_all_functions.txt")
    with open(outpath2, 'w', encoding='utf-8', errors='replace') as f:
        for fn in sorted(symbols['all_functions']):
            f.write(fn + '\n')
    print(f"  Functions saved to: {outpath2}")

    # Save categorized by group
    for cat, items in categories.items():
        outpath = os.path.join(OUTPUT_DIR, f"pdb_cat_{cat}.txt")
        with open(outpath, 'w', encoding='utf-8', errors='replace') as f:
            for item in sorted(items):
                f.write(item + '\n')
        print(f"  [{cat}] saved: {outpath}")

    # Print summary of network + protocol + dtu specifically
    print(f"\n{'='*60}")
    print(f"KEY FINDINGS - Network/Protocol/DTU Symbols")
    print(f"{'='*60}")
    for group in ['network', 'dtu', 'protocol', 'gprs', 'serial']:
        items = sorted(categories[group])
        if items:
            print(f"\n[{group}]")
            for item in items:
                try:
                    print(f"  {item}")
                except:
                    pass

    print("\nStep 2b complete!")

if __name__ == '__main__':
    main()
