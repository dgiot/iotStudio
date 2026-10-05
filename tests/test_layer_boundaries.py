"""Layer boundaries as tests: the decoupling claims of the ontology layer, machine-enforced.

Why this file exists
--------------------
`team/14` (the layer map) states the rule that makes the ontology layer decoupled:
a business domain lives in a plugin, registers itself through the public API, and the platform
never depends on a specific domain. That rule was only in prose, so a future edit could break it
silently. These tests turn it into a build-time guard.

The rules (measured on ontology-union-bridge-20261005, 2026-10-05):
  1. src/graph_store.py -- the ontology core -- imports only the standard library plus rdflib.
     No web framework, no config, no plugin, no business domain.
  2. src/web/rdf_bridge.py -- the consumer that assembles the union -- imports only the standard
     library, rdflib, and the plugin *runtime* (..plugin_runtime). It never imports a plugin.
  3. Nothing under src/ imports the `plugins` package, in any form. The dependency direction is
     plugins -> src, never src -> plugins.
  4. Nothing under src/ imports a module by a plugin's directory name.

Violations are reported with the offending file and import, so the fix is obvious. If a rule
genuinely must change, change it here with a reason -- do not delete the guard.
"""
from __future__ import annotations

import ast
import os
import sys

import pytest

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(REPO, "src")
STDLIB = set(getattr(sys, "stdlib_module_names", set()))

# The ontology core may depend on rdflib and nothing else outside the standard library.
CORE_ALLOWED_THIRD_PARTY = {"rdflib"}
# The union consumer may also use the plugin runtime -- the seam through which a domain registers --
# but never a concrete plugin.
CONSUMER_ALLOWED_THIRD_PARTY = {"rdflib"}
CONSUMER_ALLOWED_RELATIVE_PREFIXES = ("..plugin_runtime",)

CORE = os.path.join(SRC, "graph_store.py")
CONSUMER = os.path.join(SRC, "web", "rdf_bridge.py")


def _imports(path: str):
    """Return (absolute_roots, relative_strings) as written in the source."""
    with open(path, encoding="utf-8", errors="replace") as fh:
        tree = ast.parse(fh.read())
    absolute, relative = set(), set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                absolute.add(alias.name.split(".")[0])
        elif isinstance(node, ast.ImportFrom):
            if node.level and node.module:
                relative.add("." * node.level + node.module)
            elif node.level:
                relative.add("." * node.level)
            elif node.module:
                absolute.add(node.module.split(".")[0])
    return absolute, relative


def _third_party(absolute):
    return sorted(name for name in absolute if name not in STDLIB)


def _python_files_under(root):
    for base, _dirs, files in os.walk(root):
        for name in files:
            if name.endswith(".py"):
                yield os.path.join(base, name)


def test_ontology_core_depends_only_on_stdlib_and_rdflib():
    """Rule 1: the core stays free of web/config/plugin/domain imports."""
    assert os.path.isfile(CORE), "src/graph_store.py is the ontology core and must exist"
    absolute, relative = _imports(CORE)
    extra = sorted(set(_third_party(absolute)) - CORE_ALLOWED_THIRD_PARTY)
    assert not extra, (
        "src/graph_store.py must import only the standard library plus rdflib.\n"
        "Unexpected third-party import(s): %s\n"
        "If this is intentional, add it to CORE_ALLOWED_THIRD_PARTY in this test WITH a reason "
        "-- the point of the rule is that the ontology core never depends on a business domain."
        % ", ".join(extra)
    )
    assert not relative, (
        "src/graph_store.py must not use relative imports (it is the bottom of this layer).\n"
        "Found: %s" % ", ".join(sorted(relative))
    )


def test_union_consumer_touches_only_runtime_and_rdflib():
    """Rule 2: the consumer may use the plugin runtime seam, never a concrete plugin."""
    assert os.path.isfile(CONSUMER), "src/web/rdf_bridge.py assembles the union and must exist"
    absolute, relative = _imports(CONSUMER)
    extra = sorted(set(_third_party(absolute)) - CONSUMER_ALLOWED_THIRD_PARTY)
    assert not extra, (
        "src/web/rdf_bridge.py must import only the standard library plus rdflib.\n"
        "Unexpected third-party import(s): %s" % ", ".join(extra)
    )
    bad_rel = sorted(
        rel for rel in relative
        if not any(rel.startswith(prefix) for prefix in CONSUMER_ALLOWED_RELATIVE_PREFIXES)
    )
    assert not bad_rel, (
        "src/web/rdf_bridge.py may only use the plugin runtime seam (%s).\n"
        "Unexpected relative import(s): %s"
        % (", ".join(CONSUMER_ALLOWED_RELATIVE_PREFIXES), ", ".join(bad_rel))
    )


def test_platform_never_imports_the_plugins_package():
    """Rule 3: the dependency direction is plugins -> src, never the reverse.

    This is the rule that makes "add a domain without touching the platform" true rather than
    aspirational: the moment src/ imports plugins/, the platform knows about a domain.
    """
    offenders = []
    for path in _python_files_under(SRC):
        absolute, relative = _imports(path)
        for name in sorted(absolute):
            if name == "plugins" or name.startswith("plugins."):
                offenders.append("%s imports %s" % (os.path.relpath(path, REPO), name))
    assert not offenders, (
        "Files under src/ must not import the plugins package (plugins depend on src, not the"
        " other way around).\nOffenders:\n  " + "\n  ".join(offenders)
    )


def test_no_platform_module_is_named_after_a_plugin():
    """Rule 4: a plugin's directory name must not appear as an import root inside src/.

    Catches the sneaky variant that rule 3 misses (e.g. importing `ontology_demo` directly after
    a path shim was added).
    """
    plugins_dir = os.path.join(REPO, "plugins")
    if not os.path.isdir(plugins_dir):
        pytest.skip("no plugins/ directory in this checkout")
    plugin_names = {
        name for name in os.listdir(plugins_dir)
        if os.path.isdir(os.path.join(plugins_dir, name)) and not name.startswith((".", "_"))
    }
    if not plugin_names:
        pytest.skip("plugins/ contains no plugin directories")
    offenders = []
    for path in _python_files_under(SRC):
        absolute, _relative = _imports(path)
        hit = sorted(absolute & plugin_names)
        if hit:
            offenders.append("%s imports %s" % (os.path.relpath(path, REPO), ", ".join(hit)))
    assert not offenders, (
        "Platform code must not import a plugin by its directory name.\nOffenders:\n  "
        + "\n  ".join(offenders)
    )
