"""Unit tests for iotstudio-sdk (no live hub required)."""
import importlib
import json
import os
import sys

import pytest

SDK_DIR = os.path.join(os.path.dirname(__file__), "..", "sdk")
if SDK_DIR not in sys.path:
    sys.path.insert(0, SDK_DIR)

client_mod = importlib.import_module("iotstudio_sdk.client")
mqtt_mod = importlib.import_module("iotstudio_sdk.mqtt")
from iotstudio_sdk import IotStudio, Subscriber, parse_doctrine_topic  # noqa: E402


class FakeResponse:
    def __init__(self, status=200, payload=None, text=""):
        self.status_code = status
        self._payload = payload
        self.text = text or json.dumps(payload)

    def json(self):
        if self._payload is None:
            raise ValueError("no json")
        return self._payload

    def raise_for_status(self):
        if self.status_code >= 400:
            raise RuntimeError(self.status_code)


class FakeSession:
    def __init__(self):
        self.headers = {}
        self.posts = []
        self.gets = []

    def post(self, url, data=None, headers=None, timeout=None):
        self.posts.append((url, data, headers))
        return FakeResponse(200, {"sessionToken": "r:abc123", "role": "admin"})

    def get(self, url, params=None, timeout=None):
        self.gets.append((url, params))
        return FakeResponse(200, {"results": [{"objectId": "p1"}], "count": 1})


def make_client():
    s = FakeSession()
    c = IotStudio(base_url="http://hub:5080", session=s)
    return c, s


def test_login_sends_text_plain_quirk_and_binds_bearer():
    c, s = make_client()
    data = c.login("admin", "pw")
    assert data["sessionToken"] == "r:abc123"
    url, body, headers = s.posts[0]
    assert url.endswith("/iotapi/login")
    assert headers["Content-Type"] == "text/plain"
    assert json.loads(body)["username"] == "admin"
    assert s.headers["Authorization"] == "Bearer r:abc123"


def test_login_415_raises_auth_error():
    c, s = make_client()
    s.post = lambda *a, **k: FakeResponse(415, {"error": "unsupported"})
    with pytest.raises(client_mod.StudioAuthError):
        c.login("admin", "pw")


def test_products_reads_parse_class_route_with_bearer():
    c, s = make_client()
    c.login("admin", "pw")
    out = c.products(limit=3, skip=0, keys=["name"])
    assert out["results"][0]["objectId"] == "p1"
    url, params = s.gets[0]
    assert url.endswith("/iotapi/classes/Product")
    assert params["limit"] == 3
    assert params["keys"] == "name"


def test_devices_filters_by_product_pointer():
    c, s = make_client()
    c.login("admin", "pw")
    c.devices(limit=2, product_id="prod1")
    url, params = s.gets[0]
    assert url.endswith("/iotapi/classes/Device")
    assert '"className": "Product"' in params["where"]
    assert '"objectId": "prod1"' in params["where"]


def test_devices_without_product_omits_where():
    c, s = make_client()
    c.login("admin", "pw")
    c.devices()
    _, params = s.gets[0]
    assert "where" not in params


def test_forbidden_119_surfaces_as_studio_forbidden():
    c, s = make_client()
    c.login("admin", "pw")
    s.get = lambda *a, **k: FakeResponse(200, {"error": "GET_PRODUCT Forbidden",
                                               "code": 119})
    with pytest.raises(client_mod.StudioForbidden):
        c.products()


def test_doctrine_grammar_matches_and_rejects():
    ok = parse_doctrine_topic("dgiot/siteA/gw1/dev-siteA-d1/pt1/data")
    assert ok == {"site": "siteA", "gateway": "gw1",
                  "device": "dev-siteA-d1", "point": "pt1"}
    for bad in ("dgiot/a/b/c/d", "dgiot/a/b/c/d/state", "dg/a/b/c/d/data",
                "dgiot//b/c/d/data"):
        assert parse_doctrine_topic(bad) is None


class FakePaho:
    def __init__(self, client_id):
        self.client_id = client_id
        self.username_pw_set_args = None
        self.subs = []
        self.connected = False

    def username_pw_set(self, u, p):
        self.username_pw_set_args = (u, p)

    def subscribe(self, topic, qos=0):
        self.subs.append((topic, qos))

    def connect(self, host, port, keepalive):
        self.host = (host, port)
        self.connected = True

    def loop_start(self):
        pass

    def loop_stop(self):
        pass

    def disconnect(self):
        pass

    def on_connect(self, *a):
        pass

    def on_message(self, *a):
        pass


def test_subscriber_registers_and_resubscribes_on_connect():
    holder = {}
    def factory(client_id):
        holder["c"] = FakePaho(client_id)
        return holder["c"]
    seen = []
    s = Subscriber(client_factory=factory).subscribe("dgiot/#",
                                                     lambda t, m: seen.append(t))
    s.start()
    assert holder["c"].connected
    s._on_connect(holder["c"], None, None, 0)
    assert holder["c"].subs == [("dgiot/#", 1)]


def test_subscriber_native_credentials():
    holder = {}
    def factory(client_id):
        holder["c"] = FakePaho(client_id)
        return holder["c"]
    Subscriber(host="h", client_factory=factory,
               username="pid", password="secret")
    assert holder["c"].username_pw_set_args == ("pid", "secret")


def test_on_message_wildcard_tail_dispatch_and_json():
    s = Subscriber(client_factory=lambda cid: FakePaho(cid))
    seen = []
    s.subscribe("dgiot/#", lambda t, m: seen.append((t, m)))
    class Msg:
        topic = "dgiot/siteA/gw1/dev1/pt1/data"
        payload = json.dumps({"v": 21.5}).encode()
    s._on_message(None, None, Msg())
    assert seen == [(Msg.topic, {"v": 21.5})]
