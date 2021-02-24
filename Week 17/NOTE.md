# 第十七周学习笔记

[TOC]

## Yeoman 创建脚手架
和工具链不同。

一般把 generator 称为脚手架。

Yeoman 是当前社区比较流行的脚手架的生成器，是 generator 的 generator。

通过 Yeoman 框架，可以轻易的开发一个初始化项目，创建模板的脚手架。

需要全局安装 yo，然后到目录中安装 yeoman-generator 和 yeoman-environment。

### 通过命令行和用户交互
this.prompt 等待用户输入。

### 和文件系统交互
文件模板系统 this.fs.copyTpl

### Yeoman 依赖系统
对 npm 进行了简单包装，用起来更舒适。
this.fs.extendJSON，可以创建依赖文件 package.json。this.npmInstall 方法安装依赖。

## 搭建 Vue 脚手架
npm 模块间很容易出现版本兼容问题，单独升级某个模块可能引起报错。
由于 HtmlWebpackPlugin 插件报错，必须使用 webpack v4，使用 v5 会报错。
由于 webpack v4 问题，css-loader 需要指定 v4 版本， copy-webpack-plugin 需要指定 v6 版本。
所以 webpack v5 升级会影响很多模块的兼容性。

使用 Yeoman 初始化项目很方便，大大加快了配置开发环境的速度。

工具链配置更多的是工程问题，配置完插件模块后需要测试。


## webpack
最初是为打包 Node 代码 设计的，所以在处理 html 等，会有一些不方便的地方。

安装时分为 webpack 和 webpack-cli 两个包，一般项目依赖 webpack 包。

推荐使用 npx 运行命令。

loader 是 webpack 的灵魂。执行一个文本转换的过程。
plugin 不是 loader，是另一个独立的机制。

webpack.config.js 中的重要配置项：
entry
module > rules：配置 loader

## babel
与 webpack 无关的一套工具，转换 js 代码。

核心包是 @babel/core 和 @babel/cli。需要作为开发依赖包安装。

babel 的配置很复杂，所以提供了若干套预定义好的配置，一般使用 @babel/preset-env，也需要安装。

在 webpack 中使用时，一般配合 babel-loader，对每个文件进行 babel 转换。

