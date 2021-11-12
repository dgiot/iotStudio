#!/usr/bin/env bash
set -e
npm i -g @antfu/ni --registry=https://registry.npmmirror.com
ni install
cd -
exec /bin/bash
