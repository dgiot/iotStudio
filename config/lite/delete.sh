#!/bin/sh
set -e
#./config/lite/delete.sh && pnpm build
# 删除的配置文件路径并拷贝配置文件到项目根目录
echo "delete-config: starting"
rm -rf ./delete.sh
rm -rf ./vue.config.js
rm -rf ./package.json
rm -rf ./pnpm-lock.yaml
cp -r ./config/lite/* ./
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

exec /bin/bash
