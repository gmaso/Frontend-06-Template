# 第十七周学习笔记

[TOC]

## Yeoman 创建脚手架
和工具链不同。

一般把 generator 称为脚手架。

Yeoman 是当前社区比较流行的脚手架的生成器，是 generator 的 generator。

通过 Yeoman 框架，可以轻易的开发一个初始化项目，创建模板的脚手架。

需要全局安装 yo，然后到目录中安装 yeoman-generator 和 yeoman-environment。

通过命令行和用户交互
this.prompt 等待用户输入。

和文件系统交互
文件模板系统 this.fs.copyTpl

Yeoman 依赖系统
对 npm 进行了简单包装，用起来更舒适。
this.fs.extendJSON，可以创建依赖文件 package.json。this.npmInstall 方法安装依赖。


