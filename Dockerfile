# ============================================================
# dgiot_lite — 轻量物联网平台 Docker 镜像
# ============================================================
FROM python:3.10-slim

LABEL maintainer="dgiot" \
      description="DG-IoT Lite — Python 轻量物联网平台"

WORKDIR /app

# ── 系统依赖 ──
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ make curl \
    && rm -rf /var/lib/apt/lists/*

# ── Python 依赖 (先于源码，利用 Docker 缓存) ──
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── 源码 ──
COPY . .

# ── 前端构建 (可选，失败不阻塞) ──
RUN if [ -d frontend-vue ]; then \
      cd frontend-vue && npm install && npm run build || true; \
    fi

# ── 数据目录 ──
RUN mkdir -p /app/data /app/logs

EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["python", "run.py"]
