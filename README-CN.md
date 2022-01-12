# dgiot-dashboard 轻量级工业物联网平台

<p align="center">
  <img src="https://img.shields.io/github/commit-activity/m/dgiot/dgiot-dashboard" alt="ommit-activity">
	<img src="https://badgen.net/badge/package/%40dgiot%2Fdgiot-dashboard/blue"
	alt="package" maxretrytimes="3" class="m-1 transition-all duration-1000">
	<img src="https://badgen.net/npm/v/@dgiot/dgiot-dashboard" alt="Npm Version"
	maxretrytimes="3" class="m-1 transition-all duration-1000">
	<img src="https://badgen.net/npm/node/@dgiot/dgiot-mqtt-dashboard" alt="Node Version"
	maxretrytimes="3" class="m-1 transition-all duration-1000">
	<br>
	<img src="https://badgen.net/jsdelivr/hits/npm/@dgiot/dgiot-dashboard"
	alt="Jsdeliver Month Downloads" maxretrytimes="3" class="m-1 transition-all duration-1000">
	<img src="https://badgen.net/npm/types/@dgiot/dgiot-dashboard" alt="Type Support"
	maxretrytimes="3" class="m-1 transition-all duration-1000">
  <img src="https://img.shields.io/badge/Community-DGIOT-yellow" alt="Community">
  <img src="https://img.shields.io/docker/pulls/dgiot/dgiot-dashboard" alt="docker">
	<br>
	<img src="https://img.shields.io/librariesio/release/npm/@dgiot/dgiot-dashboard"
	alt="Outdated Dep" maxretrytimes="3" class="m-1 transition-all duration-1000">
	<img src="https://img.shields.io/snyk/vulnerabilities/npm/@dgiot/dgiot-dashboard"
	alt="Vulnerablities" maxretrytimes="3" class="m-1 transition-all duration-1000">
  <img src="https://img.shields.io/github/release/dgiot/dgiot-dashboard?color=brightgreen" alt="release">
  <img src="https://img.shields.io/github/license/dgiot/dgiot-dashboard" alt="license">
  <img src="https://img.shields.io/circleci/build/github/dgiot/dgiot-dashboard/master?style=flat-square" alt="circleci">
  <img src="https://api.netlify.com/api/v1/badges/e89ab785-b26a-4096-b3b9-c5e149a78588/deploy-status" alt="netlify">
  <a href='https://gitee.com/dgiiot/dgiot-dashboard/stargazers'><img src='https://gitee.com/dgiiot/dgiot-dashboard/badge/star.svg?theme=dark' alt='star'></img></a>
  <a href='https://gitee.com/dgiiot/dgiot-dashboard/stargazers'><img src='https://gitee.com/dgiiot/dgiot-dashboard/widgets/widget_card.svg?colors=ffffff,1e252b,323d47,455059,d7deea,99a0ae' alt='star'></img></a>
<p>
  
  ## DG-IoT简介
DG-IoT是国内首款轻量级开源工业物联网平台，我们致力于提供五类物联网解决方案：
+ **国企/研究院**：平台代码开源，无版权产权困扰，国产无“卡脖”之忧
+ **系统集成商**：通用设备海量接入、定制设备二次开发、30分钟一键式私有化快速部署，低成本（降90%成本）
+ **工业设备制造商**：海量设备上线运维，不受公有云限制，低成本，短周期自建平台，私有化部署，数据安全
+ **开源平台开发者**：一键式开发环境，集成和兼容各种最优开源工具，快速承接物联网项目
+ **垂直领域物联网平台**：快速部署私有化平台，千万级承载，运营级底座，全开放扩展

## 快速体验与微信群
| 微信技术支持群 | [QQ技术支持群](https://jq.qq.com/?_wv=1027&k=LipWZvDe)   | 小程序体验 |电脑端https://prod.iotn2n.com|
|:---:|:---:|:---:|:---:|
| ![image](https://user-images.githubusercontent.com/51999461/148872364-3999b7f0-17c7-47ec-8a98-3f410ab5b58e.png) |<img src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/QQ%E6%8A%80%E6%9C%AF%E7%BE%A4%E4%BA%8C%E7%BB%B4%E7%A0%81.png" width = "60%" /> |<img src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/dgiot_release/dgiot_wechat.jpg" width = "60%" />|账号密码均为：dgiot_admin|

  
![微服务架构图_02.png](https://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/web/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84%E5%9B%BE_02.png)

dgiot 前端框架



## 相关源码地址项目源码

| 源码平台 | 源码地址                                                                                      |
| -------- | --------------------------------------------------------------------------------------------- |
| github   | [https://github.com/dgiot/dgiot-dashboard](https://github.com/dgiot/dgiot-dashboard?from=git) |
| gitee    | [https://gitee.com/dgiiot/dgiot-dashboard](https://gitee.com/dgiiot/dgiot-dashboard?from=git) |

## 开发环境

[下载 dgiot_develop_tools](https://dgiot-dev-1306147891.cos.ap-nanjing.myqcloud.com/msys64/msys64.zip)

## 安装使用

- 获取项目代码

```bash
git clone https://github.com.cnpmjs.org/dgiot/dgiot-dashboard.git
```

- 安装依赖

```bash
cd dgiot-dashboard

npm i -g pnpm --registry=https://registry.npmmirror.com

pnpm config set registry https://registry.npmmirror.com

pnpm -v

pnpm install
```

- 运行

```bash
pnpm dev
```

- 运行成功
  ![b65e47b3-afcf-9bf4-4190-ab6c557ef217.png](https://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/web/b65e47b3-afcf-9bf4-4190-ab6c557ef217.png)

- [本地预览](http://localhost/)

- 登录

  | 用户名      | 密码        |
  | ----------- | ----------- |
  | dgiot_admin | dgiot_admin |

- 设备详情预览
  ![b87bd877-7cb6-f6b6-1eac-ae17b39bf928.png](https://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/web/b87bd877-7cb6-f6b6-1eac-ae17b39bf928.png)
- [项目预览](https://tech.iotn2n.com/zh/frontend/web/#%E9%A1%B9%E7%9B%AE%E9%A2%84%E8%A7%88)
- 打包

```bash
yarn build
```


