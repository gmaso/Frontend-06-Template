# 第十九周学习笔记

[TOC]

## 发布系统
其实分为三个子系统：
1. 线上服务系统（为真实用户服务）
1. 发布系统（程序员使用，向线上服务系统发布的系统。可以和线上服务系统同级部署，也可以是单独集群。）
1. 发布工具（命令行的对接工具）

## 实现一个线上 Web 服务
采用 linux 系统服务器搭建线上服务系统。

最广泛使用的框架是 express。

对于前后端彻底分离的架构，前端是只提供 html，再使用 ajax 向服务端请求数据。
这种情况下，前端只发布静态文件。

使用 npx express-generator 快速初始化 express 项目。
```
mkdir server
npx express-generator
npm install
```
初始化后生成目录结构。
使用的 jade 模板。

server 项目不需要 routes 和 views，可以删除对应的代码和文件夹。

### 上传代码到服务器
通过 ssh 服务，使用 scp 命令拷贝代码。

服务器上不要使用 npm install，防止被某些没节操的包坑。
直接把 node_modules 本地拷贝到服务器或者使用 npm ci 命令。

npm ci 旨在用于自动化环境，而且明显比常规 npm install 更快。与 npm install 的区别：
- 项目必须有 package-lock.json 或 npm-shrinkwrap.json
- 程序包锁中的依赖项与 package.json 不匹配时，将退出并显示错误；而 npm install 可能会更新包
- 只能执行全新安装，不能添加单个依赖
- 如果 node_modules 已经存在，npm ci 将删除后重新安装
- npm ci 永远不会写入 package.json 或任何包锁

使用 npm ci 可以避免大多数由于包安装引起的环境不一致问题。


## 实现一个发布系统
发布服务由一个发布的服务器端和一个发布工具构成。

服务器端和发布工具通过 http 通信。

文件传输使用流（stream）。

### 流式传输
- 可读流：data 事件调用获取数据，end 事件流结束。
- 只写流：write 方法，end 方法。write 方法是异步方法，有回调，有个写队列，返回 false 表示还没写完；drain 事件表示流写完了。

通过在发布工具中读取文件，使用流传输到服务端。

### 写文件
服务器端把接收的流存到文件中。

### 发布
添加 publish-server 和 publist-tool 本身的发布脚本，使用 scp 传输文本到服务器。
常用功能也添加到脚本字段中，方便使用 npm start 调用。