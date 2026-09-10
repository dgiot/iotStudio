"""MQTT live-data subscriber for the DG-IoT hub.

Two supported styles (both verified live):
- doctrine topics: dgiot/{site}/{gateway}/{device}/{point}/data with an
  anonymous client using client_id "edge-hub-*" (PDP policy glob);
- native topics: $dg/thing/{product}/{devaddr}/... with product-secret
  credentials (pass username/client_id/password to Subscriber).

The doctrine grammar is the only storage grammar (CLAUDE.md); variants
are surfaced as parse failures, never silently stored.
"""
import json
import re

TOPIC_RE = re.compile(
    r"^dgiot/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/"
    r"([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)/data$")


def parse_doctrine_topic(topic):
    """Return {'site','gateway','device','point'} for grammar-conforming
    topics, else None (variants must not be stored)."""
    m = TOPIC_RE.match(topic)
    if not m:
        return None
    return dict(zip(("site", "gateway", "device", "point"), m.groups()))


class Subscriber:
    """Thin paho-mqtt wrapper with injectable client factory for tests."""

    def __init__(self, host="127.0.0.1", port=1883, client_id="edge-hub-sdk",
                 username=None, password=None, keepalive=60,
                 client_factory=None):
        self.host = host
        self.port = port
        self._client_factory = client_factory or self._default_client
        self._client = self._client_factory(client_id)
        if username is not None:
            self._client.username_pw_set(username, password or "")
        self._client.on_connect = self._on_connect
        self._client.on_message = self._on_message
        self._subscriptions = []          # (topic, qos, callback)
        self._connected = False
        self.keepalive = keepalive

    @staticmethod
    def _default_client(client_id):
        import paho.mqtt.client as mqtt
        try:  # paho >= 2.0 pins the callback API version explicitly
            return mqtt.Client(mqtt.CallbackAPIVersion.VERSION1,
                               client_id=client_id, clean_session=False)
        except AttributeError:  # paho 1.x
            return mqtt.Client(client_id=client_id, clean_session=False)

    def _on_connect(self, client, _userdata, _flags, rc, _props=None):
        self._connected = True
        for topic, qos, _cb in self._subscriptions:
            client.subscribe(topic, qos=qos)

    def _on_message(self, _client, _userdata, msg):
        for topic, _qos, callback in self._subscriptions:
            if _topic_matches(topic, msg.topic):
                callback(msg.topic, _decode_payload(msg.payload))

    def subscribe(self, topic, callback, qos=1):
        """Register a callback(topic, payload_dict) and (re)subscribe."""
        self._subscriptions.append((topic, qos, callback))
        if self._connected:
            self._client.subscribe(topic, qos=qos)
        return self

    def start(self):
        self._client.connect(self.host, self.port, self.keepalive)
        self._client.loop_start()
        return self

    def wait(self):
        """Block forever (Ctrl+C to stop)."""
        try:
            while True:
                import time
                time.sleep(3600)
        except KeyboardInterrupt:
            self.stop()

    def stop(self):
        self._client.loop_stop()
        try:
            self._client.disconnect()
        except Exception:
            pass


def _decode_payload(raw):
    try:
        return json.loads(raw.decode("utf-8", errors="replace"))
    except ValueError:
        return {"raw": raw.decode("utf-8", errors="replace")[:200]}


def _topic_matches(filter_topic, topic):
    """Only exact and wildcard-tail (#) filters are supported here."""
    if filter_topic == topic:
        return True
    if filter_topic.endswith("/#"):
        prefix = filter_topic[:-1]
        return topic.startswith(prefix)
    return False
