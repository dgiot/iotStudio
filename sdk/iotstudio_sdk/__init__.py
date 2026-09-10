"""iotstudio-sdk: Palantir-OSDK-lite developer face for the DG-IoT hub.

Ten lines: login -> read catalog -> subscribe live device data.
"""
from .client import IotStudio, StudioAuthError, StudioForbidden
from .mqtt import Subscriber, parse_doctrine_topic

__all__ = [
    "IotStudio",
    "StudioAuthError",
    "StudioForbidden",
    "Subscriber",
    "parse_doctrine_topic",
]
__version__ = "0.1.0"
