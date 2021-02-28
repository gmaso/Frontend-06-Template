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



