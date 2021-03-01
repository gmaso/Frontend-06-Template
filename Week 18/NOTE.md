# 第十八周学习笔记

[TOC]

## 单页测试工具 | Mocha
当前比较流行的测试框架是 Mocha 和 Jest，大同小异。

Mocha 最初也是用于测试 Node.js 代码，所以采用了 Node.js 的模块化策略。

在被测试代码中，必须写成 Node.js 模块，使用 module.exports 导出被测函数，这会影响正常代码书写。Mocha 可以使用 --require 参数配合 babel-register 模块解决这问题。

最佳实践：调用 local 安装的工具，否则会受当前环境的影响。能用新语法就用新语法。

通常，测试脚本与被测脚本同名，后缀改为 test.js。

Mocha 默认运行 test 子目录中的测试脚本。但默认只执行 test 下第一层，要包含子目录，需要添加 --recursive 参数。

Mocha 可以通过命令行参数控制行为。

Package.json 文件中 scripts 内命令默认会使用 local 安装版本。

## code coverage
衡量测试的覆盖率。

使用 Istanbuljs 下的 nyc 工具。

nyc 和 babel 需要相互安装一个插件后才能完成覆盖率统计。
- nyc 配置 @istanbuljs/nyc-config-babel
- babel 配置 babel-plugin-istanbul



## 实例：测试 HTML parser
使用 mocha 测试先前课程中编写的 parser.js 文件。

配置 vscode 测试环境

通过单元测试，发现之前能跑起来的代码中其实有很多小错误和没考虑到的地方。

一般来说，单元测试应该覆盖 100% 的函数和 90% 以上的行。


## 集成所有工具到脚手架
运行 yo 命令后，快速生成 build、test、coverage 基本开发环境。



## 工具链总结
工具链是为了前端开发的质量和效率服务。
- 通过 generator 快速搭建开发环境，搞定 webpack、babel、mocha 等配置，大大提升开发效率。
- 通过 mocha 结合 nyc，给单元测试加了简单实例，方便添加测试用例，保证前端开发的质量。
- Yeoman 用起来很方便，初始化项目 so easy

