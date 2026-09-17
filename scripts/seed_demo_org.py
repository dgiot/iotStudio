#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
演示组织架构种子 — 部门 + 用户
==============================
给用户管理 / 角色管理页灌可看的演示数据。

落盘位置（**都不进 git**）:
  data/users.local.json   登录账号（src/auth.py 装载，见 load_local_users）
  data/parse.db           _Role 部门树 + _User 账号镜像

为什么账号不写进 src/auth.py:
  本目录是公开提交副本，账号密码写进源码 = 写进公开 git 历史，收不回来。
  源码里只留 4 个演示账号，其余一律落 data/users.local.json（data/ 已 gitignore）。

密码：**必须由环境变量 `DG_DEMO_PASSWORD` 给，源码里不留默认值。**
  理由同「敏感配置永不进入 git 历史」—— 本目录是公开提交副本，写一个固定口令
  进源码，就是把口令写进公开历史，收不回来。「演示口令公开无害」不构成理由：
  固定的默认值会在真实部署里被原样留着，这正是默认口令之所以是问题。
  照 `DG_HUB_HOST` 那条惯例：部署侧事实经环境给，公开仓不留真值。

用法:
  DG_DEMO_PASSWORD=<口令> python scripts/seed_demo_org.py            # 灌数据
  DG_DEMO_PASSWORD=<口令> python scripts/seed_demo_org.py --dry-run  # 只看要写什么
  DG_DEMO_PASSWORD=<口令> python scripts/seed_demo_org.py --reset    # 先清掉本脚本造的行再灌
"""
import argparse
import hashlib
import json
import os
import sqlite3
import sys
from datetime import datetime

# Windows 控制台默认代码页是 GBK：往 stdout/stderr 写非 GBK 字符（🔴 / ✗ / ✅）
# 会抛 UnicodeEncodeError，或退化成不可读的转义。**两个流都要改** —— 只改 stdout
# 的话，报错信息（stderr）仍然是乱码，而报错信息恰好是这行代码存在的理由。
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "src"))

DB_PATH = os.path.join(ROOT, "data", "parse.db")
USERS_LOCAL = os.path.join(ROOT, "data", "users.local.json")

DEMO_PASSWORD = os.environ.get("DG_DEMO_PASSWORD", "")


def require_demo_password():
    """口令缺失 ⇒ 停手。

    ⚠️ `--dry-run` 也走这一道，不是顺手多写。若 dry-run 放行而真跑报错，
    那 dry-run 的绿灯就不能预测真跑 —— 与「基线为空＝空过」同族：
    一个不预测结果的检查比没有检查更坏，因为它会让人不去看真的那一关。
    """
    if not DEMO_PASSWORD:
        print(
            "🔴 未设置 DG_DEMO_PASSWORD —— 演示口令必须由环境给，公开仓不留默认值。\n"
            "   Windows:  set DG_DEMO_PASSWORD=<口令> && python scripts/seed_demo_org.py\n"
            "   Linux:    DG_DEMO_PASSWORD=<口令> python scripts/seed_demo_org.py",
            file=sys.stderr,
        )
        return 2
    return 0

# ═══════════════════════════════════════════════════════════
# 部门树 —— _Role 表里 parent_id 为空的是部门/租户（对齐 list_departments）
# (objectId, 名称, 父节点, 说明)
# ═══════════════════════════════════════════════════════════
DEPARTMENTS = [
    ("default",    "默认租户",   None,        "系统默认租户，内置账号归属地"),
    ("prod-dept",  "生产运行部", "default",   "现场生产运行与值守"),
    ("maint-dept", "设备管理部", "default",   "设备台账、检修与备件"),
    ("data-dept",  "数据分析部", "default",   "时序分析、报表与模型"),
    ("demo-dept",  "演示租户",   None,        "对外演示专用，可随时清空"),
    ("oil-monitor", "设备完整性", "default",  "设备完整性监测（原有）"),
]

# ═══════════════════════════════════════════════════════════
# 演示账号  (用户名, 姓名, 角色, 部门, 说明)
# 内置的 admin / dgiot_dev / dgiot / operator 不在此列（在 auth.py 里）
# ═══════════════════════════════════════════════════════════
DEMO_USERS = [
    ("liu.gm",    "刘工",   "admin",    "prod-dept",  "生产运行部主管"),
    ("zhang.ops", "张运维", "operator", "maint-dept", "设备巡检与检修"),
    ("wang.ana",  "王分析", "viewer",   "data-dept",  "报表与趋势查看"),
    ("chen.field", "陈现场", "operator", "prod-dept",  "现场值守"),
    ("li.demo",   "李演示", "viewer",   "demo-dept",  "演示账号，只读"),
]

# 内置账号的部门归属（auth.py 默认给 default，这里按岗位挪一下）
BUILTIN_DEPT = {
    "admin": "default",
    "dgiot": "default",
    "dgiot_dev": "default",
    "operator": "maint-dept",
}


def sha256(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()


def now_iso() -> str:
    return datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z")


def seed_departments(db, dry=False):
    """写 _Role 部门树"""
    written = 0
    for oid, name, parent, desc in DEPARTMENTS:
        row = db.execute('SELECT objectId FROM "_Role" WHERE objectId = ?', (oid,)).fetchone()
        data = json.dumps({"desc": desc, "department": True}, ensure_ascii=False)
        if row:
            if dry:
                print(f"    = 部门已存在，更新说明: {oid} {name}")
                continue
            db.execute('UPDATE "_Role" SET name=?, alias=?, parent_id=?, data=?, updatedAt=? WHERE objectId=?',
                       (name, oid, parent, data, now_iso(), oid))
        else:
            if dry:
                print(f"    + 部门: {oid:12s} {name:10s} 父={parent}")
                written += 1
                continue
            db.execute('INSERT INTO "_Role" (objectId, name, alias, parent_id, data, ACL, createdAt, updatedAt)'
                       ' VALUES (?,?,?,?,?,?,?,?)',
                       (oid, name, oid, parent, data, "{}", now_iso(), now_iso()))
        written += 1
    return written


def seed_user_rows(db, all_users, dry=False):
    """写 _User 镜像行。department 没有真实列，塞进 data JSON（_row_to_obj 会摊平）"""
    written = 0
    for username, name, role, dept, desc in all_users:
        row = db.execute('SELECT objectId FROM "_User" WHERE username = ?', (username,)).fetchone()
        data = json.dumps({"name": name, "desc": desc, "department": dept}, ensure_ascii=False)
        if row:
            if not dry:
                db.execute('UPDATE "_User" SET role=?, data=?, updatedAt=? WHERE username=?',
                           (role, data, now_iso(), username))
            continue
        oid = hashlib.md5(f"{username}-{now_iso()}".encode()).hexdigest()[:20]
        if dry:
            print(f"    + 用户行: {username:11s} {name:6s} {role:9s} {dept}")
            written += 1
            continue
        db.execute(
            'INSERT INTO "_User" (objectId, username, password_hash, email, phone, role,'
            ' sessionToken, sessionExpires, data, ACL, createdAt, updatedAt)'
            ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            (oid, username, sha256(DEMO_PASSWORD), "", "", role,
             None, None, data, "{}", now_iso(), now_iso()))
        written += 1
    return written


def seed_users_file(dry=False):
    """写 data/users.local.json —— src/auth.py 从这里装载可登录账号"""
    users = {}
    for username, name, role, dept, desc in DEMO_USERS:
        users[username] = {
            "password": sha256(DEMO_PASSWORD),   # 存 sha256，文件里不留明文
            "role": role, "name": name, "desc": desc,
            "department": dept, "enabled": True, "created": now_iso()[:10],
        }
    payload = {
        "_note": "本地扩展账号 —— 本文件在 data/ 下，已被 .gitignore 忽略，不会进公开仓",
        "_generated_by": "scripts/seed_demo_org.py",
        "users": users,
    }
    if dry:
        print(f"    → 将写 {USERS_LOCAL}：{len(users)} 个账号 "
              f"({', '.join(users)})")
        return len(users)
    os.makedirs(os.path.dirname(USERS_LOCAL), exist_ok=True)
    with open(USERS_LOCAL, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return len(users)


def reset(db, dry=False):
    """清掉本脚本造的行（内置账号与原有部门不动）"""
    demo_names = [u[0] for u in DEMO_USERS]
    if dry:
        print(f"    - 将删 {len(demo_names)} 个演示账号行 + {len(DEPARTMENTS) - 2} 个新增部门")
        return
    for n in demo_names:
        db.execute('DELETE FROM "_User" WHERE username = ?', (n,))
    for oid, _n, _p, _d in DEPARTMENTS:
        if oid not in ("default", "oil-monitor"):
            db.execute('DELETE FROM "_Role" WHERE objectId = ?', (oid,))
    if os.path.exists(USERS_LOCAL):
        os.remove(USERS_LOCAL)


def main():
    ap = argparse.ArgumentParser(description="演示组织架构种子")
    ap.add_argument("--dry-run", action="store_true", help="只显示要写什么")
    ap.add_argument("--reset", action="store_true", help="先清掉本脚本造的行")
    args = ap.parse_args()

    rc = require_demo_password()
    if rc:
        return rc

    if not os.path.exists(DB_PATH):
        print(f"✗ 找不到 {DB_PATH} —— 先跑一次 python run.py 让它建库")
        return 1

    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row

    if args.reset:
        print("═══ 清理旧数据 ═══")
        reset(db, args.dry_run)

    print("═══ 部门（_Role 树）═══")
    n_dept = seed_departments(db, args.dry_run)

    all_users = [(u, n, r, d, s) for u, n, r, d, s in DEMO_USERS]
    # 内置账号也补一行镜像，管理页才看得到部门
    builtin = [("admin", "管理员", "admin", BUILTIN_DEPT["admin"], "系统管理员"),
               ("dgiot", "DG-IoT管理员", "admin", BUILTIN_DEPT["dgiot"], "平台管理员"),
               ("dgiot_dev", "DG-IoT开发者", "admin", BUILTIN_DEPT["dgiot_dev"], "平台开发者"),
               ("operator", "运维操作员", "operator", BUILTIN_DEPT["operator"], "日常运维")]

    print("\n═══ 用户（_User 镜像行）═══")
    n_urow = seed_user_rows(db, all_users + builtin, args.dry_run)

    print("\n═══ 登录账号（data/users.local.json）═══")
    n_acct = seed_users_file(args.dry_run)

    if not args.dry_run:
        db.commit()
    db.close()

    print(f"\n{'（dry-run，未落盘）' if args.dry_run else '完成'}: "
          f"部门 {n_dept} · 用户行 {n_urow} · 登录账号 {n_acct}")
    if not args.dry_run:
        # 不回显口令值 —— 控制台输出会进日志/复制粘贴，公开仓的脚本更不该开这个头。
        # 口令是你自己经环境给进来的，不需要我回显给你。
        print("演示口令：DG_DEMO_PASSWORD 指定的值（不回显）")
        print("重启后端（python run.py）后 auth.py 才会装载新账号。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
