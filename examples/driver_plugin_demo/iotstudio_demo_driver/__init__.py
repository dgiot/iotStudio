"""Demo external driver: registers via the iotstudio.drivers entry point group.

Recipe for adding a NEW PROTOCOL without touching engine code:
1. create a package whose module defines a BaseProtocolAdapter subclass;
2. declare [project.entry-points."iotstudio.drivers"] in pyproject.toml;
3. pip install the package - the engine discovers it on next startup
   (plugin_registry.discover_entry_points).
"""
from .driver import DemoSimDriver

__all__ = ["DemoSimDriver"]
