#!/usr/bin/env bash
set -e
npm install -g pnpm --registry=https://registry.npmmirror.com
pnpm config set registry https://registry.npmmirror.com
pnpm add -g pnpm to update
pnpm -v
pnpm config get registry
pnpm install
cd -
exec /bin/bash
