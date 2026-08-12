"""
Step 2: PDB Symbol Analysis - Extract and classify symbols from LegacyComm.pdb
"""
import os, re, struct, sys, json
from collections import defaultdict

LOCAL_DIR = "D:/ai/dgiot_lite/reverse/commbridge/downloaded"
OUTPUT_DIR = "D:/ai/dgiot_lite/reverse/commbridge"

def extract_strings_from_pdb(pdb_path, min_len=4):
    """Extract readable strings from PDB binary using Python."""
    strings_found = []
    try:
        with open(pdb_path, 'rb') as f:
            data = f.read()

        current = b''
        for byte in data:
            if 32 <= byte < 127 or byte in (9, 10, 13):
                current += bytes([byte])
            else:
                if len(current) >= min_len:
                    strings_found.append(current.decode('ascii', errors='ignore'))
                current = b''
        if len(current) >= min_len:
            strings_found.append(current.decode('ascii', errors='ignore'))
    except Exception as e:
        print(f"  Error extracting strings from PDB: {e}")
    return strings_found

def extract_pdb_symbols(pdb_path):
    """
    Extract symbol-like strings from PDB file.
    PDB files contain debug information including function names, class names, etc.
    """
    symbols = {
        'classes': set(),
        'functions': set(),
        'methods': set(),
        'variables': set(),
        'types': set(),
        'namespaces': set(),
    }

    try:
        with open(pdb_path, 'rb') as f:
            data = f.read()

        # Try to extract all readable strings
        # PDB symbols often have specific patterns
        text = data.decode('latin-1')

        # MSVC name decoration patterns
        # Class names: .?AVClassName@@
        class_pattern = re.compile(r'\.\?AV(\w+)@@')
        for m in class_pattern.finditer(text):
            symbols['classes'].add(m.group(1))

        # Function patterns in PDB
        func_pattern = re.compile(r'([A-Za-z_]\w+)\s*\(|(?:public|private|protected):\s*(?:virtual\s+)?(\w+)\(', re.IGNORECASE)

        # Namespace patterns
        ns_pattern = re.compile(r'(\w+(?:::\w+)+)')

        # Find all function-like strings (word followed by parenthesis)
        # But also try to extract undecorated names using the PDB stream format

        # The PDB (Program Database) format is complex. Let's use simpler approach:
        # Extract all readable strings of sufficient length and categorize them

        # PDB contains OMAP streams, type info, symbol records

        # Type descriptor patterns in PDB - MSVC RTTI
        rtti_pattern = re.compile(r'\?AU(\w+)@@')
        for m in rtti_pattern.finditer(text):
            symbols['types'].add(m.group(1))

        rtti_class_pattern = re.compile(r'\?AV(\w+)@@')
        for m in rtti_class_pattern.finditer(text):
            cls = m.group(1)
            if not any(c in cls for c in '?*<>'):
                symbols['classes'].add(cls)

        # Extract undecorated function names from PDB symbol records
        # PDB symbol records often contain names in a specific format
        # Let's try to find Name Strings (which are null-terminated in the stream)

        # Find C++ decorated names and try to extract the base name
        decorated_pattern = re.compile(r'\?(\w+)@')
        for m in decorated_pattern.finditer(text):
            name = m.group(1)
            if 3 < len(name) < 100 and not name.startswith('?'):
                symbols['functions'].add(name)

        # Source file patterns
        # Extract potential function names from "FPO" data or other PDB records

        # Also try to extract strings that look like identifiers
        ident_pattern = re.compile(r'[A-Za-z_]\w{3,60}')
        for m in ident_pattern.finditer(text):
            ident = m.group()
            # Skip common keywords and noise
            if ident.lower() in ('this', 'that', 'void', 'int', 'char', 'bool', 'true', 'false', 'null',
                                 'nullptr', 'class', 'struct', 'public', 'private', 'protected',
                                 'virtual', 'static', 'const', 'extern', 'inline', 'return',
                                 'ifdef', 'endif', 'define', 'include', 'using', 'namespace',
                                 'std', 'string', 'vector', 'map', 'list', 'auto', 'decltype',
                                 'sizeof', 'typedef', 'enum', 'unsigned', 'signed', 'long', 'short',
                                 'double', 'float', 'byte', 'word', 'dword', 'qword'):
                continue
            # Skip hex-like strings
            if re.match(r'^[0-9A-Fa-f]{8,}$', ident):
                continue
            if len(ident) >= 8 and ident.isupper():
                continue  # Likely a macro constant

            # Check if it looks like a function/method name (camelCase or contains underscore)
            if re.match(r'^[a-z][a-zA-Z0-9]{3,}', ident) or '_' in ident:
                if not ident[0].isdigit():
                    symbols['functions'].add(ident)

    except Exception as e:
        print(f"  Error processing PDB: {e}")

    return symbols

def identify_network_protocol_symbols(symbols):
    """Categorize symbols by their relevance to network/protocol operations."""
    categories = defaultdict(set)

    network_keywords = ['send', 'recv', 'socket', 'tcp', 'udp', 'connect', 'listen', 'bind',
                        'accept', 'wsa', 'ioctl', 'overlap', 'iocp', 'completion', 'readfile',
                        'writefile', 'transmit', 'ws2', 'winsock', 'ipaddr', 'endpoint',
                        'getaddrinfo', 'freeaddrinfo', 'ntohs', 'htons', 'ntohl', 'htonl',
                        'select', 'poll', 'epoll', 'WSASend', 'WSARecv']

    protocol_keywords = ['modbus', 'rtu', 'mbap', 'pdu', 'register', 'coil', 'discrete',
                         'holding', 'input', 'frame', 'header', 'crc', 'checksum', 'crc16',
                         'lrc', 'slave', 'station', 'address', 'protocol', 'parser',
                         'packet', 'datagram', 'payload', 'serialize', 'deserialize',
                         'encode', 'decode', 'pack', 'unpack', 'readdata', 'writedata',
                         'reply', 'request', 'response', 'command', 'function']

    dtu_keywords = ['dtu', 'gprs', 'register', 'login', 'auth', 'heartbeat', 'keepalive',
                    'ping', 'pong', 'session', 'token', 'imei', 'imsi', 'serial', 'deviceid',
                    'terminal', 'handshake', 'timeout', 'retry']

    config_keywords = ['ini', 'config', 'cfg', 'xml', 'json', 'registry', 'regkey',
                       'setting', 'option', 'parameter', 'param', 'profile', 'readsetting',
                       'writesetting', 'getprivate', 'writeprivate']

    oracle_keywords = ['oracle', 'oci', 'sql', 'database', 'connection', 'query', 'execute',
                       'select', 'insert', 'update', 'delete', 'stored', 'procedure',
                       'ado', 'oledb', 'odbc']

    thread_keywords = ['thread', 'mutex', 'critical', 'semaphore', 'event', 'wait',
                       'signal', 'lock', 'synchronize', 'createthread', 'beginthread',
                       'pool', 'worker', 'callback', 'apc']

    for name in symbols['classes'] | symbols['functions'] | symbols['types']:
        name_lower = name.lower()

        for kw in network_keywords:
            if kw.lower() in name_lower:
                categories['network'].add(name)
                break

        for kw in protocol_keywords:
            if kw.lower() in name_lower:
                categories['protocol'].add(name)
                break

        for kw in dtu_keywords:
            if kw.lower() in name_lower:
                categories['dtu_terminal'].add(name)
                break

        for kw in config_keywords:
            if kw.lower() in name_lower:
                categories['config'].add(name)
                break

        for kw in oracle_keywords:
            if kw.lower() in name_lower:
                categories['oracle_db'].add(name)
                break

        for kw in thread_keywords:
            if kw.lower() in name_lower:
                categories['thread_pool'].add(name)
                break

    return categories

def run_strings_on_pdb(pdb_path, min_len=5):
    """Use external strings command if available, otherwise use Python."""
    import subprocess

    # Try using GNU strings or Sysinternals strings
    possible_strings = [
        r"C:\Program Files (x86)\GnuWin32\bin\strings.exe",
        r"C:\Program Files\GnuWin32\bin\strings.exe",
        r"C:\msys64\usr\bin\strings.exe",
        r"C:\cygwin64\bin\strings.exe",
    ]

    strings_cmd = None
    for sp in possible_strings:
        if os.path.exists(sp):
            strings_cmd = sp
            break

    if strings_cmd:
        try:
            result = subprocess.run(
                [strings_cmd, "-n", str(min_len), pdb_path],
                capture_output=True, timeout=60
            )
            output = result.stdout.decode('latin-1', errors='ignore')
            return output.split('\n')
        except Exception as e:
            print(f"  strings command failed: {e}")

    # Fallback to Python implementation
    return extract_strings_from_pdb(pdb_path, min_len)

def analyze_pdb():
    """Main analysis function."""
    pdb_file = os.path.join(LOCAL_DIR, "LegacyComm.pdb")

    if not os.path.exists(pdb_file):
        print(f"  PDB not found at {pdb_file}")
        # Look for any PDB
        for f in os.listdir(LOCAL_DIR):
            if f.endswith('.pdb'):
                pdb_file = os.path.join(LOCAL_DIR, f)
                print(f"  Found PDB: {pdb_file}")
                break
        else:
            print("  No PDB files found!")
            return None, None

    pdb_size = os.path.getsize(pdb_file)
    print(f"\n  PDB file size: {pdb_size:,} bytes ({pdb_size/1024/1024:.1f} MB)")

    # Extract symbols
    print("\n  Extracting symbols from PDB...")
    symbols = extract_pdb_symbols(pdb_file)

    for category, items in symbols.items():
        print(f"\n  [{category}] {len(items)} found")
        if items:
            # Show first 20 sorted
            sorted_items = sorted(items)
            for item in sorted_items[:20]:
                print(f"    {item}")
            if len(sorted_items) > 20:
                print(f"    ... and {len(sorted_items) - 20} more")

    # Categorize symbols
    print("\n\n  Categorizing symbols...")
    categories = identify_network_protocol_symbols(symbols)

    for cat_name, items in sorted(categories.items()):
        print(f"\n  [{cat_name}] {len(items)} items:")
        for item in sorted(items):
            print(f"    {item}")

    # Extract all strings from PDB
    print("\n\n  Extracting all readable strings from PDB (min 6 chars)...")
    all_strings = run_strings_on_pdb(pdb_file, min_len=6)
    print(f"  Total strings extracted: {len(all_strings)}")

    return symbols, all_strings

def analyze_exe_pdb():
    """Analyze DLL PDBs too."""
    for f in os.listdir(LOCAL_DIR):
        if f.endswith('.pdb') and f != 'LegacyComm.pdb':
            pdb_path = os.path.join(LOCAL_DIR, f)
            print(f"\n{'='*60}")
            print(f"Analyzing additional PDB: {f}")
            print(f"{'='*60}")
            syms, strs = analyze_pdb_file(pdb_path)
            if syms:
                outpath = os.path.join(OUTPUT_DIR, f"{os.path.splitext(f)[0]}_pdb_symbols.json")
                with open(outpath, 'w', encoding='utf-8') as fp:
                    json.dump({k: sorted(v) for k,v in syms.items()}, fp, indent=2, ensure_ascii=False)
                print(f"  Saved to {outpath}")

if __name__ == '__main__':
    print("=" * 60)
    print("Step 2: PDB Symbol Analysis")
    print("=" * 60)

    symbols, strings = analyze_pdb()

    if symbols:
        # Save symbols
        outpath = os.path.join(OUTPUT_DIR, "pdb_symbols_analyzed.json")
        with open(outpath, 'w', encoding='utf-8') as f:
            json.dump({k: sorted(v) for k,v in symbols.items()}, f, indent=2, ensure_ascii=False)
        print(f"\n  Symbols saved to: {outpath}")

        # Save categorized symbols
        categories = identify_network_protocol_symbols(symbols)
        cat_outpath = os.path.join(OUTPUT_DIR, "pdb_categories.json")
        with open(cat_outpath, 'w', encoding='utf-8') as f:
            json.dump({k: sorted(v) for k,v in categories.items()}, f, indent=2, ensure_ascii=False)
        print(f"  Categories saved to: {cat_outpath}")

    if strings:
        strings_outpath = os.path.join(OUTPUT_DIR, "pdb_strings_all.txt")
        with open(strings_outpath, 'w', encoding='utf-8') as f:
            for s in strings:
                f.write(s + '\n')
        print(f"  All strings saved to: {strings_outpath}")

    # Analyze DLL PDBs too
    analyze_exe_pdb()

    print("\nStep 2 complete!")
