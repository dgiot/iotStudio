#!/usr/bin/env python3
"""Unit tests for the doctrine-chain connector's topic parsing and payload
mapping (no broker / TDengine needed)."""
import importlib.util
import os

import pytest

_spec = importlib.util.spec_from_file_location(
    "dgiot_td_connector",
    os.path.join(os.path.dirname(__file__), "..",
                 "connectors", "dgiot_td_connector.py"))
conn = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(conn)


def test_topic_regex_matches_doctrine_grammar():
    m = conn.TOPIC_RE.match(
        "dgiot/siteA/gw1/dev-siteA-d1/pt1/data")
    assert m is not None
    assert m.groups() == ("siteA", "gw1", "dev-siteA-d1", "pt1")


def test_topic_regex_rejects_variants():
    # CLAUDE.md: topic grammar is fixed; variants must not be stored
    for bad in (
        "dgiot/siteA/gw1/dev/pt1",              # missing /data
        "dgiot/siteA/gw1/dev/pt1/data/extra",   # extra segment
        "dg/siteA/gw1/dev/pt1/data",            # wrong prefix
        "dgiot//gw1/dev/pt1/data",              # empty site
        "dgiot/siteA/gw1/dev/pt1/state",        # wrong leaf
    ):
        assert conn.TOPIC_RE.match(bad) is None, bad


def test_safe_sanitizes_table_fragments():
    assert conn.SAFE.sub("_", "dev-siteA-d1") == "dev_siteA_d1"
    assert conn.SAFE.sub("_", "a.b/c") == "a_b_c"
    assert len(conn.SAFE.sub("_", "x" * 99)) == 99


def test_val_extraction_prefers_numeric():
    assert conn._val({"v": 21.5}) == 21.5
    assert conn._val({"value": 7}) == 7.0
    assert conn._val({"v": "notnum", "other": 1}) == 0.0
    assert conn._val({}) == 0.0
