# dgiot-dashboard 轻量级工业物联网平台
<p align="center">
  <img src="https://img.shields.io/github/commit-activity/m/dgiot/dgiot-dashboard" alt="ommit-activity">
	<img src="https://badgen.net/badge/package/%40dgiot%2Fdgiot-dashboard/blue"
	alt="package" maxretrytimes="3" class="m-1 transition-all duration-1000">
  <img src="https://img.shields.io/github/release/dgiot/dgiot-dashboard?color=brightgreen" alt="release">


  
  ## DGIoT平台简介
DGIoT是国内首款轻量级工业物联网开源平台，我们致力于为5类客户提供物联网解决方案：
+ **国企/研究院**：平台代码开源，无版权产权困扰，国产无“卡脖”之忧
+ **系统集成商**：通用设备海量接入、定制设备二次开发、30分钟一键式私有化快速部署，低成本（降90%成本）
+ **工业设备制造商**：海量设备上线运维，不受公有云限制，低成本，短周期自建平台，私有化部署，数据安全
+ **开源平台开发者**：一键式开发环境，集成和兼容各种最优开源工具，快速承接物联网项目
+ **垂直领域物联网平台**：快速部署私有化平台，千万级承载，运营级底座，全开放扩展

## 平台快速体验与技术交流微信群
| 微信技术支持群 |官网 https://www.dgiotcloud.cn/| [QQ技术支持群](https://jq.qq.com/?_wv=1027&k=LipWZvDe)： 346566935   | 
|:---:|:---:|:---:|
|<img src="https://prod.dgiotcloud.cn/dgiot_file/website/wx.jpg" width = "60%" /> |**平台体验网址**</br><br/>https://prod.dgiotcloud.cn<br/></br><br/>**账号密码按体验类型已默认填写**</br>|<img src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/QQ%E6%8A%80%E6%9C%AF%E7%BE%A4%E4%BA%8C%E7%BB%B4%E7%A0%81.png" width = "60%" /> |

## 特色功能
+ 可视化组态编辑器
+ 低代码快速开发

  
![微服务架构图_02.png](https://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/web/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84%E5%9B%BE_02.png)

dgiot 前端框架



## 相关源码地址项目源码

| 源码平台 | 源码地址                                                                                      |
| -------- | --------------------------------------------------------------------------------------------- |
| github   | [https://github.com/dgiot/dgiot-dashboard](https://github.com/dgiot/dgiot-dashboard?from=git) |
| gitee    | [https://gitee.com/dgiiot/dgiot-dashboard](https://gitee.com/dgiiot/dgiot-dashboard?from=git) |
  
## 小程序体验 

  <img src="http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/dgiot_release/dgiot_wechat.jpg" width = "20%" />
## 开发环境

[下载 dgiot_develop_tools](https://dgiot-dev-1306147891.cos.ap-nanjing.myqcloud.com/msys64/msys64.zip)

## 安装使用

- 获取项目代码

```bash
git clone -b master https://github.com.cnpmjs.org/dgiot/dgiot-dashboard.git
```

- 安装依赖

```bash
cd dgiot-dashboard

npm install yarn -g

yarn config set registry https://registry.npm.taobao.org -g

yarn -v

yarn install
```

- 运行

```bash
yarn dev
```

- 运行成功
  ![b65e47b3-afcf-9bf4-4190-ab6c557ef217.png](https://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/shuwa_tech/zh/frontend/web/b65e47b3-afcf-9bf4-4190-ab6c557ef217.png)

- [本地预览](http://localhost/)

- 登录

  | 用户名      | 密码        |
  | ----------- | ----------- |
  | dgiot_admin | dgiot_admin |
- 系统首页
![](https://prod.dgiotcloud.cn/dgiot_file/website/head.png)
- 设备组态预览
![](https://prod.dgiotcloud.cn/dgiot_file/website/konva.png)
- 设备详情实时数据查看
  ![](https://prod.dgiotcloud.cn/dgiot_file/website/realcard.png)
- [项目预览](https://tech.iotn2n.com/zh/frontend/web/#%E9%A1%B9%E7%9B%AE%E9%A2%84%E8%A7%88)
- 打包

```bash
yarn build
```


