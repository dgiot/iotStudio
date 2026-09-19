"""嵌入式 PG 口令的解析 —— 每处落点各配执行者。

被它测的是 `scripts/init_parse.py:pg_password()`。它此前没有执行者：
口令是个写死的字面量，没有任何东西在判它该不该在那儿。

只测三条**分支**（环境优先 / 落盘复用 / 有库无口令时停手），不测随机性 ——
`secrets.token_urlsafe` 的强度不是本仓能判的，测它等于测标准库。
"""
import importlib.util
import os
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


def _load():
    spec = importlib.util.spec_from_file_location(
        "init_parse_under_test", ROOT / "scripts" / "init_parse.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)      # 模块级只有常量与 HEADERS，无副作用
    return mod


@pytest.fixture()
def mod(tmp_path, monkeypatch):
    m = _load()
    monkeypatch.setattr(m, "BASE_DIR", str(tmp_path))
    monkeypatch.delenv("DG_PG_PASSWORD", raising=False)
    return m


def test_env_wins_and_nothing_is_written(mod, tmp_path):
    """环境给了就用它，且**不该**顺手落盘 —— 部署侧给的值不进本机 data/。"""
    os.environ["DG_PG_PASSWORD"] = "from-env-value"
    try:
        assert mod.pg_password() == "from-env-value"
    finally:
        os.environ.pop("DG_PG_PASSWORD", None)
    assert not (tmp_path / "data" / "pg_password").exists()


def test_generates_persists_and_is_stable(mod, tmp_path):
    """没给就生成 + 落盘，且**第二次必须拿到同一个**。

    不稳定的后果不是「不安全」，是**连不上**：已建的 pgdata 认的是第一次那个口令。
    """
    first = mod.pg_password()
    assert first and len(first) >= 16
    assert (tmp_path / "data" / "pg_password").read_text(encoding="utf-8") == first
    assert mod.pg_password() == first


def test_refuses_when_pgdata_exists_without_password_file(mod, tmp_path):
    """负控：有库但没有口令文件 ⇒ 必须停手，**不许退回默认口令**。

    退回默认正是「把字面量从源码挪进代码路径」—— 门禁看不见了，风险一点没少。
    """
    (tmp_path / "data" / "pgdata").mkdir(parents=True)
    with pytest.raises(SystemExit) as e:
        mod.pg_password()
    assert e.value.code == 2
    assert not (tmp_path / "data" / "pg_password").exists()


def test_source_carries_no_password_literal():
    """判据本体：源码里不许再有那个字面量。

    与门禁的凭据规则重叠，**是故意的** —— 门禁在仓外（`_organize/scan_iotstudio.py`）、
    钩子在 `.git/hooks`（不受版本控制，重克隆就没了，而消失的钩子与通过的钩子
    长得一样）。这条随仓库走，克隆到哪跟到哪。
    """
    src = (ROOT / "scripts" / "init_parse.py").read_text(encoding="utf-8")
    # 拼出来写，免得这行自己变成一条命中 —— 判据不该给自己造阳性
    needle = 'password="' + 'postgres"'
    assert needle not in src
