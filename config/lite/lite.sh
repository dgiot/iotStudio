#!/bin/sh
set -e
# ./config/lite/delete.sh
# 删除的配置文件路径并拷贝配置文件到项目根目录
echo "delete-config: starting"
rm -rf ./lite.sh ./vue.config.js  ./package.json ./pnpm-lock.yaml ./cli.config.js ./src/config/cli.config.js
cp -r ./config/lite/* ./
rm -rf ./public/index.html
cp -r ./index.html ./public/index.html
cp -r ./cli.config.js ./src/config/cli.config.js
echo "delete-config: success"

# 删除的组件文件路径
echo "delete-view: starting"
rm -rf ./src/dgiot/components/VabDrawerCode/
rm -rf ./src/dgiot/components/VabAmis/
rm -rf ./src/dgiot/components/VabMonaco/
rm -rf ./src/dgiot/components/VabMonacoPlus/
# 删除的页面文件路径
rm -rf ./src/views/cloudFunction/
rm -rf ./src/views/CloudTest/
rm -rf ./src/views/DeviceCloud/manage/component/profile/ProfileDescriptions.vue
echo "delete-view: success"
#if [ -f "./package.json" ];
#then
#  pnpm build
#else
#  echo "this script only runs in targeting dev's PR deploy preview, bye"
#fi
exec /bin/bash
