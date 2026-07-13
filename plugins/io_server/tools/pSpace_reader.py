#!/usr/bin/env python3
"""
pSpace TagID 数据读取器
======================
解析本地 IO ServerOnLine/run/ 目录中的 pSpace/pPluse TagID 文件。
不需要网络连接，直接读本地二进制文件。

用法: python pSpace_reader.py

数据来源:
  D:\ai\io服务器分析\IO ServerOnLine\run\TagID_IOCommitDB*_pSpace.dat
  D:\ai\io服务器分析\IO ServerOnLine\run\TagID_IOCommitDB*_pPluse.dat
"""
import os, re
from collections import Counter

BASE = r"D:\ai\io服务器分析\IO ServerOnLine\run"


def parse_tagid_files():
    """解析所有 pSpace/pPluse TagID 文件"""
    all_tags = []
    for fname in sorted(os.listdir(BASE)):
        if 'pSpace' not in fname and 'pPluse' not in fname:
            continue
        path = os.path.join(BASE, fname)
        with open(path, 'rb') as f:
            text = f.read().decode('gbk', errors='ignore')
        # Extract structured paths
        paths = re.findall(r'/CY1C7K/[A-Za-z0-9/]+', text) + \
                re.findall(r'/gscyc/[A-Za-z0-9/]+', text)
        for p in paths:
            p = re.sub(r'[^A-Za-z0-9/]+$', '', p.strip())
            if len(p) < 15: continue
            parts = p.strip('/').split('/')
            if len(parts) < 3: continue
            well = parts[1]
            last = parts[-1]
            # Extract point type from embedded code
            pt = ''
            for known in ['TGP','DCV','GYS','CPV','UCV','ZHL','CDL','TGT','ZWG','DWL',
                          'ADY','CHC','UWL','CDY','CZT','ADL','ZYG','BDL','EGT','RCV',
                          'SLV','BDY','HGT','SAQ','MFQ','ZWG2','TGP2','ADY2','CZT5',
                          'JRH','ROT','WLV','BPP','PDL','PDY','FDD','BPV','BPS','BPT']:
                if last.endswith(known):
                    pt = known; break
            if not pt: continue
            all_tags.append({
                'source': 'pSpace' if 'gscyc' in p else 'pPluse',
                'file': fname, 'path': p,
                'site': parts[0], 'well': well,
                'station': parts[2][:8] if len(parts[2]) >= 8 else '',
                'point_code': pt,
            })
    return all_tags


def main():
    print("pSpace TagID Data Reader v1.0")
    print(f"Source: {BASE}")
    print()

    tags = parse_tagid_files()
    print(f"Total tags: {len(tags)}")

    # Stats
    sites = Counter(t['site'] for t in tags)
    wells = Counter(t['well'] for t in tags)
    pts = Counter(t['point_code'] for t in tags)

    print(f"\nSites: {dict(sites)}")
    print(f"Wells: {len(wells)} (CY1C7K field)")
    print(f"Point types: {len(pts)}")

    print(f"\nTop 20 well by tag count:")
    for w, c in wells.most_common(20):
        print(f"  {w}: {c}")

    print(f"\nPoint type distribution:")
    for pt, c in pts.most_common(20):
        print(f"  {pt}: {c}")

    print(f"\nSample paths (10):")
    for t in tags[:10]:
        print(f"  {t['path']}")

    # Export
    csv_path = os.path.join(os.path.dirname(BASE), '../../docs/pSpace_tags.csv')
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    with open(csv_path, 'w', encoding='utf-8-sig') as f:
        f.write("来源,站点,井号,计量间,测点类型,完整路径\n")
        for t in sorted(tags, key=lambda x: (x['source'], x['site'], x['well'])):
            f.write(f"{t['source']},{t['site']},{t['well']},{t['station']},{t['point_code']},{t['path']}\n")
    print(f"\nExported: {csv_path}")
    print("Done.")


if __name__ == "__main__":
    main()
