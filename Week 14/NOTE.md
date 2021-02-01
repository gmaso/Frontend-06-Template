# 第十四周学习笔记

[TOC]


## 组件的基本知识 | 组件的基本概念和基本组成部分

前端架构两大热门话题：
组件化：扩展 HTML 标签，目标是复用，重中之重，提升代码复用率
架构模式：前端与数据逻辑层的交互，MVC、MVVM 等

组件偏向于 UI 相关。

#### 对象和组件的区别

对象：Properties、Methods、Inherit
组件：Properties、Methods、Inherit、Attribute、Config & State、Event、Lifecycle、Children（形成树形结构的必要条件，提升描述界面能力）



#### 组件的概念

![image-20210131215727390](http://static.gmaso.cn/blog/2021/01/31/21/f88d8ef2c1ec4ad7b1e36567df8cc4d5-df5e75-image-20210131215727390.png?imageslim)

三方交互：用户、组件开发者、组件使用者



#### Property 与 Attribute 区别

Attribute 强调描述性，一般出现在 HTML 中，如 ele.getAttribute('x')

Property 强调从属关系，一般出现在 JavaScript 中，如 ele.x



使用 property 和 attribute 获取的异同，一般 attribute 是设置值，property 是语义化后的对象

class: property 要使用 className 获取

style: attribute 是设置值，property 是解析后的对象

href: attribute 是原始值，property 是解析后的

input: attribute 是设置的默认值，property 获取和变化时优先



![image-20210131215816215](http://static.gmaso.cn/blog/2021/01/31/21/fdb2e406338427e7f11308a4612e9d1f-6f93f0-image-20210131215816215.png?imageslim)

权衡状态使用哪个方式传递。



![image-20210131215848027](http://static.gmaso.cn/blog/2021/01/31/21/3732882f19c037740646969f0996ab2b-e548ae-image-20210131215848027.png?imageslim)



#### Children

Content 型：有几个就显示几个

Template 型：模板，需要和数据结合才能决定显示元素的个数



## 组件的基本知识 | 为组件添加 JSX 语法

#### 配置 JSX 步骤

1. npm install -g webpack webpack-cli

2. npm install --save-dev webpack babel-loader

3. npm install --save-dev @babel/core @babel/preset-env

4. npm install --save-dev @babel/plugin-transform-react-jsx

5. 配置 webpack 和 jsx

   注意：由于 webpack 升级到 5.x，需要配套安装 webpack-cli@3。



## 轮播组件 Carousel

