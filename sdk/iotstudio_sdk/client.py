"""REST + TDengine client for the DG-IoT hub (5080 apihub face).

Auth model (probed live on dgiot 4.9.3):
- POST /iotapi/login only accepts a text/plain body (JSON otherwise 415).
- Subsequent calls carry the session token as "Authorization: Bearer <t>".
- Business reads may answer {"code":119} Forbidden when the user has no
  role-seeded rules (headless labs skip dgiot_install); surfaced as
  StudioForbidden so callers can branch instead of parsing HTML errors.
"""
import json

import requests

DEFAULT_TD_URL = "http://127.0.0.1:6041/rest/sql"
DEFAULT_TD_USER = "root"
DEFAULT_TD_PASS = "taosdata"  # TDengine factory default; override for prod


class StudioError(Exception):
    """Base SDK error."""


class StudioAuthError(StudioError):
    """Login failed or session rejected."""


class StudioForbidden(StudioError):
    """Authenticated but the user lacks dgiot role rules (code 119)."""

    def __init__(self, operation, payload):
        self.operation = operation
        self.payload = payload
        super().__init__(
            f"{operation} forbidden (code {payload.get('code')}): "
            "user has no role-seeded rules; run dgiot_install role seeding "
            "on the hub")


class IotStudio:
    """Session-scoped client for the hub business API."""

    def __init__(self, base_url="http://127.0.0.1:5080",
                 username=None, password=None, timeout=10,
                 td_url=DEFAULT_TD_URL, td_user=DEFAULT_TD_USER,
                 td_pass=DEFAULT_TD_PASS, session=None):
        self.base = base_url.rstrip("/") + "/iotapi"
        self.timeout = timeout
        self._token = None
        self.td_url = td_url
        self.td_user = td_user
        self.td_pass = td_pass
        self.session = session or requests.Session()
        if username is not None and password is not None:
            self.login(username, password)

    # -- auth ----------------------------------------------------------
    def login(self, username, password):
        """Login and keep the session token as a Bearer credential."""
        body = json.dumps({"username": username, "password": password})
        r = self.session.post(self.base + "/login", data=body,
                              headers={"Content-Type": "text/plain"},
                              timeout=self.timeout)
        if r.status_code == 415:
            raise StudioAuthError(
                "login returned 415: Content-Type must be text/plain")
        if r.status_code in (401, 403):
            raise StudioAuthError(f"login rejected: {r.text[:120]}")
        r.raise_for_status()
        data = r.json()
        token = data.get("sessionToken")
        if not token:
            raise StudioAuthError(f"no sessionToken in reply: {data}")
        self._token = token
        self.session.headers["Authorization"] = f"Bearer {token}"
        return data

    @property
    def token(self):
        return self._token

    # -- business reads (role-seeded users only on stock hubs) ----------
    def _get(self, path, **params):
        r = self.session.get(self.base + path, params=params,
                             timeout=self.timeout)
        try:
            payload = r.json()
        except ValueError:
            payload = {"raw": r.text[:200]}
        if r.status_code == 200 and "error" not in payload:
            return payload
        if payload.get("code") == 119:
            raise StudioForbidden(path, payload)
        raise StudioError(f"{path} -> {r.status_code}: {str(payload)[:160]}")

    def products(self, limit=100, skip=0):
        """Product catalog; requires role-seeded rules on stock hubs."""
        return self._get("/product", limit=limit, skip=skip)

    def devices(self, limit=100, skip=0):
        """Device list; requires role-seeded rules on stock hubs."""
        return self._get("/device", limit=limit, skip=skip)

    # -- TDengine direct read (lab/local mode) ---------------------------
    def td_query(self, sql):
        """Run one SQL against TDengine REST; returns row dicts.
        Qualify tables with the database inside the SQL itself."""
        r = requests.post(
            self.td_url,
            data=sql.encode("utf-8"),
            auth=(self.td_user, self.td_pass),
            headers={"Connection": "close"},
            timeout=self.timeout)
        data = r.json()
        if data.get("code", 0) != 0:
            raise StudioError(f"TDengine {data.get('code')}: "
                              f"{data.get('desc')}")
        cols = [c[0] for c in data.get("column_meta", [])]
        return [dict(zip(cols, row)) for row in data.get("data", [])]
