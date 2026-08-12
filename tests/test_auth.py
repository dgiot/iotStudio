"""iotStudio — auth 模块测试"""
import pytest
import time
import hashlib
from src.auth import (
    USERS, SECRET, TOKEN_EXPIRE,
    create_token, verify_token, authenticate,
    add_user, _b64_encode, _b64_decode,
)


class TestTokenRoundtrip:
    """JWT token 生成→验证 往返测试"""

    def test_create_and_verify_valid_token(self):
        token = create_token("admin", "admin")
        payload = verify_token(token)
        assert payload is not None
        assert payload["sub"] == "admin"
        assert payload["role"] == "admin"

    def test_create_and_verify_operator(self):
        token = create_token("operator", "operator")
        payload = verify_token(token)
        assert payload is not None
        assert payload["role"] == "operator"

    def test_tampered_token_rejected(self):
        token = create_token("admin", "admin")
        parts = token.split('.')
        # 篡改 payload
        tampered = parts[0] + '.AAAA' + '.' + parts[2]
        assert verify_token(tampered) is None

    def test_invalid_token_format(self):
        assert verify_token("just.one.dot") is None
        assert verify_token("") is None
        assert verify_token("...") is None

    def test_expired_token_rejected(self):
        """手动构造过期 token"""
        import json as _j, hmac as _h
        header = _b64_encode(_j.dumps({"alg": "HS256", "typ": "JWT"}).encode())
        payload = _b64_encode(_j.dumps({
            "sub": "test", "role": "admin",
            "iat": int(time.time()) - 9999,
            "exp": int(time.time()) - 1,  # 1秒前过期
        }).encode())
        sig = _b64_encode(_h.new(SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
        assert verify_token(f"{header}.{payload}.{sig}") is None


class TestAuthenticate:
    """authenticate 函数测试"""

    def test_admin_login_success(self):
        token = authenticate("admin", os.environ.get("ADMIN_PASS", "changeme"))
        assert token is not None
        payload = verify_token(token)
        assert payload["sub"] == "admin"

    def test_operator_login_success(self):
        token = authenticate("operator", "oper123")
        assert token is not None
        payload = verify_token(token)
        assert payload["role"] == "operator"

    def test_wrong_password_fails(self):
        assert authenticate("admin", "wrong") is None

    def test_nonexistent_user_fails(self):
        assert authenticate("ghost", "123456") is None

    def test_empty_credentials_fails(self):
        assert authenticate("", "") is None


class TestAddUser:
    """add_user 函数测试"""

    def test_add_new_user(self):
        ok = add_user("test_user", "test123", "operator")
        assert ok is True
        assert "test_user" in USERS
        assert USERS["test_user"]["role"] == "operator"

    def test_add_duplicate_fails(self):
        add_user("dup_user", "pw", "operator")
        ok = add_user("dup_user", "other", "admin")
        assert ok is False

    def test_add_empty_username_fails(self):
        assert add_user("", "pw") is False

    def test_authenticate_new_user(self):
        add_user("fresh", "fresh123", "operator", "test desc")
        token = authenticate("fresh", "fresh123")
        assert token is not None
        p = verify_token(token)
        assert p["sub"] == "fresh"


class TestBase64:
    """Base64 编解码"""

    def test_roundtrip(self):
        data = b"hello world test data"
        assert _b64_decode(_b64_encode(data)) == data

    def test_empty(self):
        assert _b64_decode(_b64_encode(b"")) == b""


class TestTokenInfo:
    """token 元信息"""

    def test_token_expires_in_future(self):
        token = create_token("admin", "admin")
        p = verify_token(token)
        assert p["exp"] > int(time.time())

    def test_token_has_issued_at(self):
        token = create_token("admin", "admin")
        p = verify_token(token)
        assert "iat" in p
        assert p["iat"] <= int(time.time())

    def test_default_users_exist(self):
        assert "admin" in USERS
        assert "dgiot" in USERS
        assert "operator" in USERS
        assert USERS["admin"]["enabled"] is True
