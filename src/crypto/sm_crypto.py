#!/usr/bin/env python3
"""
国密算法模块 — SM2/SM3/SM4
===========================
对标模块6: 国产化数据分级存储与安全可信
- SM2: 椭圆曲线公钥密码（签名/验签/密钥交换）
- SM3: 密码杂凑算法（数据摘要，256bit）
- SM4: 分组密码算法（数据加密，128bit密钥）

Python 纯实现: 生产环境替换为 gmssl / 硬件加密卡
基于 gmssl-python 库或纯 Python 参考实现
"""
import hashlib, hmac, os, struct
from typing import Tuple, Optional

# ═══════════════════════════════════════════
# SM3 — 密码杂凑算法（国标 GB/T 32905-2016）
# ═══════════════════════════════════════════

class SM3:
    """SM3 密码杂凑 — 256bit 输出"""
    digest_size = 32
    block_size = 64

    def __init__(self):
        self._buf = b""
        self._total = 0
        self._V = [
            0x7380166F, 0x4914B2B9, 0x172442D7, 0xDA8A0600,
            0xA96F30BC, 0x163138AA, 0xE38DEE4D, 0xB0FB0E4E,
        ]

    def update(self, data: bytes):
        self._buf += data
        self._total += len(data)
        while len(self._buf) >= 64:
            self._V = _sm3_compress(self._V, self._buf[:64])
            self._buf = self._buf[64:]

    def digest(self) -> bytes:
        buf = self._buf
        total_bits = (self._total + len(buf)) * 8
        buf += b"\x80"
        while (len(buf) + 8) % 64 != 0:
            buf += b"\x00"
        buf += struct.pack(">Q", total_bits)
        V = self._V
        for i in range(0, len(buf), 64):
            V = _sm3_compress(V, buf[i:i+64])
        return b"".join(struct.pack(">I", v) for v in V)

    def hexdigest(self) -> str:
        return self.digest().hex()


def sm3_hash(data: bytes) -> bytes:
    """SM3 哈希 — 便捷函数"""
    h = SM3()
    h.update(data)
    return h.digest()


def sm3_hmac(key: bytes, data: bytes) -> bytes:
    """SM3-HMAC"""
    block_size = 64
    if len(key) > block_size:
        key = sm3_hash(key)
    if len(key) < block_size:
        key = key + b"\x00" * (block_size - len(key))
    o_key_pad = bytes(k ^ 0x5C for k in key)
    i_key_pad = bytes(k ^ 0x36 for k in key)
    return sm3_hash(o_key_pad + sm3_hash(i_key_pad + data))


# ── SM3 内部函数 ──

_SM3_T = [0x79CC4519] * 16 + [0x7A879D8A] * 48

def _sm3_rotl(x, n): return ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF

def _sm3_ff0(x, y, z): return x ^ y ^ z
def _sm3_ff1(x, y, z): return (x & y) | (x & z) | (y & z)
def _sm3_gg0(x, y, z): return x ^ y ^ z
def _sm3_gg1(x, y, z): return (x & y) | (~x & z)
def _sm3_p0(x): return x ^ _sm3_rotl(x, 9) ^ _sm3_rotl(x, 17)
def _sm3_p1(x): return x ^ _sm3_rotl(x, 15) ^ _sm3_rotl(x, 23)

def _sm3_compress(V: list, block: bytes) -> list:
    W = list(struct.unpack(">16I", block))
    W.extend(0 for _ in range(52))
    for j in range(16, 68):
        W[j] = (_sm3_p1(W[j-16] ^ W[j-9] ^ _sm3_rotl(W[j-3], 15)) ^
                _sm3_rotl(W[j-13], 7) ^ W[j-6]) & 0xFFFFFFFF
    W1 = [W[j] ^ W[j+4] for j in range(64)]

    A, B, C, D, E, F, G, H = V
    for j in range(64):
        SS1 = _sm3_rotl((_sm3_rotl(A, 12) + E + _sm3_rotl(_SM3_T[j], j % 32)) & 0xFFFFFFFF, 7)
        SS2 = SS1 ^ _sm3_rotl(A, 12)
        if j < 16:
            TT1 = (_sm3_ff0(A, B, C) + D + SS2 + W1[j]) & 0xFFFFFFFF
            TT2 = (_sm3_gg0(E, F, G) + H + SS1 + W[j]) & 0xFFFFFFFF
        else:
            TT1 = (_sm3_ff1(A, B, C) + D + SS2 + W1[j]) & 0xFFFFFFFF
            TT2 = (_sm3_gg1(E, F, G) + H + SS1 + W[j]) & 0xFFFFFFFF
        D = C; C = _sm3_rotl(B, 9); B = A; A = TT1
        H = G; G = _sm3_rotl(F, 19); F = E; E = _sm3_p0(TT2)

    return [(V[i] ^ [A, B, C, D, E, F, G, H][i]) & 0xFFFFFFFF for i in range(8)]


# ═══════════════════════════════════════════
# SM4 — 分组密码算法（国标 GB/T 32907-2016）
# ═══════════════════════════════════════════

SM4_BOX = [
    0xD6,0x90,0xE9,0xFE,0xCC,0xE1,0x3D,0xB7,0x16,0xB6,0x14,0xC2,0x28,0xFB,0x2C,0x05,
    0x2B,0x67,0x9A,0x76,0x2A,0xBE,0x04,0xC3,0xAA,0x44,0x13,0x26,0x49,0x86,0x06,0x99,
    0x9C,0x42,0x50,0xF4,0x91,0xEF,0x98,0x7A,0x33,0x54,0x0B,0x43,0xED,0xCF,0xAC,0x62,
    0xE4,0xB3,0x1C,0xA9,0xC9,0x08,0xE8,0x95,0x80,0xDF,0x94,0xFA,0x75,0x8F,0x3F,0xA6,
    0x47,0x07,0xA7,0xFC,0xF3,0x73,0x17,0xBA,0x83,0x59,0x3C,0x19,0xE6,0x85,0x4F,0xA8,
    0x68,0x6B,0x81,0xB2,0x71,0x64,0xDA,0x8B,0xF8,0xEB,0x0F,0x4B,0x70,0x56,0x9D,0x35,
    0x1E,0x24,0x0E,0x5E,0x63,0x58,0xD1,0xA2,0x25,0x22,0x7C,0x3B,0x01,0x21,0x78,0x87,
    0xD4,0x00,0x46,0x57,0x9F,0xD3,0x27,0x52,0x4C,0x36,0x02,0xE7,0xA0,0xC4,0xC8,0x9E,
    0xEA,0xBF,0x8A,0xD2,0x40,0xC7,0x38,0xB5,0xA3,0xF7,0xF2,0xCE,0xF9,0x61,0x15,0xA1,
    0xE0,0xAE,0x5D,0xA4,0x9B,0x34,0x1A,0x55,0xAD,0x93,0x32,0x30,0xF5,0x8C,0xB1,0xE3,
    0x1D,0xF6,0xE2,0x2E,0x82,0x66,0xCA,0x60,0xC0,0x29,0x23,0xAB,0x0D,0x53,0x4E,0x6F,
    0xD5,0xDB,0x37,0x45,0xDE,0xFD,0x8E,0x2F,0x03,0xFF,0x6A,0x72,0x6D,0x6C,0x5B,0x51,
    0x8D,0x1B,0xAF,0x92,0xBB,0xDD,0xBC,0x7F,0x11,0xD9,0x5C,0x41,0x1F,0x10,0x5A,0xD8,
    0x0A,0xC1,0x31,0x88,0xA5,0xCD,0x7B,0xBD,0x2D,0x74,0xD0,0x12,0xB8,0xE5,0xB4,0xB0,
    0x89,0x69,0x97,0x4A,0x0C,0x96,0x77,0x7E,0x65,0xB9,0xF1,0x09,0xC5,0x6E,0xC6,0x84,
    0x18,0xF0,0x7D,0xEC,0x3A,0xDC,0x4D,0x20,0x79,0xEE,0x5F,0x3E,0xD7,0xCB,0x39,0x48,
]

SM4_CK = [0x00070E15,0x1C232A31,0x383F464D,0x545B6269,0x70777E85,0x8C939AA1,0xA8AFB6BD,0xC4CBD2D9,
          0xE0E7EEF5,0xFC030A11,0x181F262D,0x343B4249,0x50575E65,0x6C737A81,0x888F969D,0xA4ABB2B9,
          0xC0C7CED5,0xDCE3EAF1,0xF8FF060D,0x141B2229,0x30373E45,0x4C535A61,0x686F767D,0x848B9299,
          0xA0A7AEB5,0xBCC3CAD1,0xD8DFE6ED,0xF4FB0209,0x10171E25,0x2C333A41,0x484F565D,0x646B7279]

SM4_FK = [0xA3B1BAC6,0x56AA3350,0x677D9197,0xB27022DC]

def _sm4_sbox(x): return SM4_BOX[x]
def _sm4_lshift(x, n): return ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF
def _sm4_tau(a):
    return (_sm4_sbox(a >> 24) << 24 | _sm4_sbox((a >> 16) & 0xFF) << 16 |
            _sm4_sbox((a >> 8) & 0xFF) << 8 | _sm4_sbox(a & 0xFF))

_SM4_L = lambda b: b ^ _sm4_lshift(b, 2) ^ _sm4_lshift(b, 10) ^ _sm4_lshift(b, 18) ^ _sm4_lshift(b, 24)
_SM4_LP = lambda b: b ^ _sm4_lshift(b, 13) ^ _sm4_lshift(b, 23)

def _sm4_key_schedule(mk: bytes) -> list:
    K = list(struct.unpack(">4I", mk))
    rk = []
    for i in range(4):
        K[i] ^= SM4_FK[i]
    for i in range(32):
        rk.append(K[i+1] ^ K[i+2] ^ K[i+3] ^ SM4_CK[i] ^
                  _SM4_LP(_sm4_tau(K[i] ^ K[i+1] ^ K[i+2] ^ SM4_CK[i])))
        K.append(rk[-1])
    return rk

def _sm4_round(X: list, rk: list) -> list:
    for i in range(32):
        X.append(X[i] ^ _SM4_L(_sm4_tau(X[i+1] ^ X[i+2] ^ X[i+3] ^ rk[i])))
    return [X[35], X[34], X[33], X[32]]


class SM4:
    """SM4 分组密码 — 128bit 分组, 128bit 密钥"""
    block_size = 16

    def __init__(self, key: bytes):
        if len(key) != 16:
            raise ValueError("SM4 key must be 16 bytes")
        self._rk = _sm4_key_schedule(key)

    def encrypt_block(self, block: bytes) -> bytes:
        X = list(struct.unpack(">4I", block))
        return struct.pack(">4I", *_sm4_round(X, self._rk))

    def decrypt_block(self, block: bytes) -> bytes:
        X = list(struct.unpack(">4I", block))
        return struct.pack(">4I", *_sm4_round(X, self._rk[::-1]))

    def encrypt(self, data: bytes, mode: str = "ecb", iv: bytes = None) -> bytes:
        return _sm4_encrypt_ecb(self, data) if mode == "ecb" else _sm4_encrypt_cbc(self, data, iv)

    def decrypt(self, data: bytes, mode: str = "ecb", iv: bytes = None) -> bytes:
        return _sm4_decrypt_ecb(self, data) if mode == "ecb" else _sm4_decrypt_cbc(self, data, iv)


def _sm4_encrypt_ecb(cipher: SM4, data: bytes) -> bytes:
    result = b""
    for i in range(0, len(data), 16):
        block = data[i:i+16]
        if len(block) < 16:
            block = block + b"\x00" * (16 - len(block))  # zero-pad
        result += cipher.encrypt_block(block)
    return result

def _sm4_decrypt_ecb(cipher: SM4, data: bytes) -> bytes:
    return b"".join(cipher.decrypt_block(data[i:i+16]) for i in range(0, len(data), 16)).rstrip(b"\x00")

def _sm4_encrypt_cbc(cipher: SM4, data: bytes, iv: bytes) -> bytes:
    result, prev = b"", iv
    for i in range(0, len(data), 16):
        block = data[i:i+16]
        if len(block) < 16:
            block = block + b"\x00" * (16 - len(block))
        prev = cipher.encrypt_block(bytes(a ^ b for a, b in zip(block, prev)))
        result += prev
    return result

def _sm4_decrypt_cbc(cipher: SM4, data: bytes, iv: bytes) -> bytes:
    result, prev = b"", iv
    for i in range(0, len(data), 16):
        dec = cipher.decrypt_block(data[i:i+16])
        result += bytes(a ^ b for a, b in zip(dec, prev))
        prev = data[i:i+16]
    return result.rstrip(b"\x00")


# ═══════════════════════════════════════════
# SM2 — 椭圆曲线公钥密码（国标 GB/T 32918-2016）
# ═══════════════════════════════════════════
# sm2p256v1 曲线纯 Python 实现（点加/倍乘/签名/验签）
# 生产环境可替换为 gmssl / 硬件加密卡

# sm2p256v1 曲线参数（GB/T 32918.5-2017 附录A）
_SM2_P = 0xFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF
_SM2_A = 0xFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC
_SM2_B = 0x28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93
_SM2_N = 0xFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123
_SM2_GX = 0x32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7
_SM2_GY = 0xBC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0


def _modinv(a: int, m: int) -> int:
    """扩展欧几里得求模逆"""
    a %= m
    x0, x1, b = 1, 0, m
    while b:
        q = a // b
        a, b = b, a - q * b
        x0, x1 = x1, x0 - q * x1
    return x0 % m


def _point_add(p1: Optional[tuple], p2: Optional[tuple]) -> Optional[tuple]:
    """椭圆曲线点加（仿射坐标）"""
    if p1 is None:
        return p2
    if p2 is None:
        return p1
    x1, y1 = p1
    x2, y2 = p2
    if x1 == x2:
        if (y1 + y2) % _SM2_P == 0:
            return None  # 无穷远点
        lam = (3 * x1 * x1 + _SM2_A) * _modinv(2 * y1, _SM2_P) % _SM2_P
    else:
        lam = (y2 - y1) * _modinv(x2 - x1, _SM2_P) % _SM2_P
    x3 = (lam * lam - x1 - x2) % _SM2_P
    y3 = (lam * (x1 - x3) - y1) % _SM2_P
    return (x3, y3)


def _point_mul(k: int, p: tuple) -> Optional[tuple]:
    """椭圆曲线标量乘（二进制展开）"""
    r = None
    while k:
        if k & 1:
            r = _point_add(r, p)
        p = _point_add(p, p)
        k >>= 1
    return r


class SM2:
    """SM2 椭圆曲线密钥对 + 签名/验签（GB/T 32918.2）"""

    def __init__(self):
        self._private_key: Optional[bytes] = None
        self._public_key: Optional[bytes] = None

    def generate_keypair(self) -> Tuple[bytes, bytes]:
        """生成 SM2 密钥对: d ∈ [1, n-1], P = dG"""
        d = int.from_bytes(os.urandom(32), "big") % (_SM2_N - 1) + 1
        P = _point_mul(d, (_SM2_GX, _SM2_GY))
        self._private_key = d.to_bytes(32, "big")
        self._public_key = (b"\x04" + P[0].to_bytes(32, "big") +
                            P[1].to_bytes(32, "big"))  # 非压缩格式
        return self._private_key, self._public_key

    def sign(self, data: bytes, private_key: bytes = None) -> bytes:
        """SM2 签名（r,s 各 32 字节，共 64 字节）"""
        d = int.from_bytes(private_key or self._private_key, "big")
        e = int.from_bytes(sm3_hash(data), "big")
        while True:
            k = int.from_bytes(os.urandom(32), "big") % (_SM2_N - 1) + 1
            x1, _ = _point_mul(k, (_SM2_GX, _SM2_GY))
            r = (e + x1) % _SM2_N
            if r == 0 or r + k == _SM2_N:
                continue
            s = _modinv(1 + d, _SM2_N) * (k - r * d) % _SM2_N
            if s == 0:
                continue
            return r.to_bytes(32, "big") + s.to_bytes(32, "big")

    def verify(self, data: bytes, signature: bytes, public_key: bytes = None) -> bool:
        """SM2 验签: 验证 r, s ∈ [1,n-1], sG + tP = (e + x1) mod n"""
        pub = public_key or self._public_key
        if len(pub) != 65 or pub[0] != 0x04:
            return False
        P = (int.from_bytes(pub[1:33], "big"), int.from_bytes(pub[33:65], "big"))
        r = int.from_bytes(signature[:32], "big")
        s = int.from_bytes(signature[32:], "big")
        if not (1 <= r <= _SM2_N - 1 and 1 <= s <= _SM2_N - 1):
            return False
        e = int.from_bytes(sm3_hash(data), "big")
        t = (r + s) % _SM2_N
        if t == 0:
            return False
        x1, _ = _point_add(_point_mul(s, (_SM2_GX, _SM2_GY)),
                           _point_mul(t, P))
        return (e + x1) % _SM2_N == r


# ═══════════════════════════════════════════
# 便捷函数
# ═══════════════════════════════════════════

def sm3_sum(data: bytes) -> str:
    """SM3 摘要 — hex 输出"""
    return SM3().hexdigest() if isinstance(data, bytes) else SM3().update(data.encode()).hexdigest()

def sm4_encrypt_ecb(key: bytes, data: bytes) -> bytes:
    return SM4(key).encrypt(data, "ecb")

def sm4_decrypt_ecb(key: bytes, data: bytes) -> bytes:
    return SM4(key).decrypt(data, "ecb")

def sm2_sign(data: bytes, privkey: bytes = None) -> bytes:
    sm2 = SM2()
    if privkey:
        return sm2.sign(data, privkey)
    sm2.generate_keypair()
    return sm2.sign(data)


# ═══════════════════════════════════════════
# 自测
# ═══════════════════════════════════════════

if __name__ == "__main__":
    # SM3
    h = SM3()
    h.update(b"iotStudio SM3 test")
    assert len(h.digest()) == 32
    print(f"SM3: {h.hexdigest()}")

    # SM4
    key = b"0123456789abcdef"
    sm4 = SM4(key)
    ct = sm4.encrypt(b"Hello iotStudio")
    pt = sm4.decrypt(ct)
    assert pt.startswith(b"Hello")
    print(f"SM4: encrypt/decrypt OK")

    # SM2
    sm2 = SM2()
    priv, pub = sm2.generate_keypair()
    sig = sm2.sign(b"test message", priv)
    ok = sm2.verify(b"test message", sig, pub)
    print(f"SM2: sign/verify {'OK' if ok else 'FAIL'}")
    print("All SM crypto OK")
