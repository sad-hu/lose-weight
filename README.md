# lose-weight

> 2.0.0 文档撰写中

旧版文档请访问 [1.x](https://github.com/sad-hu/lose-weight/tree/1.x)

> 这是我在公司前端组里写的一个工具，为了方便大家处理部分接口返回的数据和部分本地的数据。

- [起源](#起源)
- [特色](#特色)
- [环境要求](#环境要求)
- [安装](#安装)
- [API](#api)
- [参与贡献](#参与贡献)
- [更新概要](#更新概要)


## 起源

在实际项目中，请求接口得到的数据，引入文件（包，组件，工具或任何可被引入的东西）得到的数据，或其他任何形式得到的数据。其中的字段有些直接可用，有些需要加工后使用，有些需要重命名后使用，有些可以完全忽略。我们需要解构这些数据结构，期间按需对字段加工（如：使用 moment 对时间戳进行格式化）或重命名，如果是以数组形式组织的数据，还得循环解构。完成这些工作的代码一般来说不够聚拢！


## 特色

- 可以处理数组类型的数据和对象类型的数据
- 可以是任何形式产生的（常见的如：接口返回，引入文件）数据，只要符合上述类型要求
- 可以将解构，重命名，数据加工代码聚拢在一起


## 环境要求

在用户代理（以下简称 ua） 运行时环境；

- 需要支持 Array.isArray api
- 需要支持 Array.prototype.map api
- 需要支持 Array.prototype.reduce api
- 需要支持 Function.prototype.bind api

在 nodejs 运行时环境：

- nodejs 需要较新（当前版本的上一个主要版本）的 lts 版（长期支持版）

注意：在 ua 中（包含 pc 浏览器端，手持设备浏览器端，pc 或手持设备或一些 app 的 webview 端等）。如果是使用项目创建工具（如：create-react-app，vue-cli，Angular CLI 等类似工具）生成的项目，开发过程中，引用这个工具时，不用担心运行时环境要求（那些项目创建工具内部一般都有 babel）。在构建时通常也会转译成兼容 ua 的代码。


## 安装

### 在项目中安装

``` bash
# 如果是在 windows powershell 中，可能需要这样
# npm install ‘@jkt/lose-weight’ --save
npm install @jkt/lose-weight --save
```

### 在代码中引用

``` javascript
// node
const {choose, assist} = require('@jkt/lose-weight')
```

或者

``` javascript
/*
  ua
  类似 create-react-app，vue-cli，Angular CLI 等工具创建的前端项目，
  内部一般都有 babel 提供支持
 */
import {choose, assist} from '@jkt/lose-weight'

// 或者
import * as loseWeight from '@jkt/lose-weight'
loseWeight.choose(/* parameters */)
loseWeight.assist(/* parameters */)
```

注意：不支持在**全局环境**中引用，如 `window.loseWeight` 或 `window.choose`，`window.assist`
