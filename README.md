# lose-weight

- [起源](#起源)
- [术语](#术语)
- [环境要求](#环境要求)
- [安装](#安装)
- [API](#api)
- [参与贡献](#参与贡献)
- [更新概要](#更新概要)

## 起源

在实际项目中，接口返回的数据，其中无效字段有多又少。对于那些无效字段多，或者需要格式化的有效字段多，或者两种情况兼具的接口返回数据，本工具将带来如下收益：

- 将有效字段的提取（解构）和字段的格式化代码集中放在一起（本工具不会修改接口返回的数据）。


## 术语

- 有效字段

  指那些接口返回的数据中，前端需要这些字段在视图层用作展示，或者在表单中需要用户修改并提交。

- 无效字段

  除有效字段之外的字段，称为无效字段。


## 环境要求

在用户代理 ua（以下简称 ua） 运行时环境；

- 需要支持 Array.isArray api
- 需要支持 Array.prototype.reduce api
- 需要支持 Object.keys api

在 nodejs 运行时环境：

- nodejs 需要较新（当前版本的上一个主要版本）的 lts 版（长期支持版）

注意：在 ua 中（包含 pc 浏览器端，手持设备浏览器端，pc 或手持设备或一些 app 的 webview 端等）。如果是使用项目创建工具（如：create-react-app，vue-cli，Angular CLI 等类似工具）生成的项目，开发过程中，引用这个工具时，不用担心运行时环境要求（那些项目创建工具内部一般都有 babel）。在构建时通常也会转译成兼容 ua 的代码。


## 安装

### 在项目中安装

``` bash
# 如果是在 windows powershell 中，可能需要这样
# npm i ‘@jkt/lose-weight’ --save
npm i @jkt/lose-weight --save
```

### 在代码中引用

``` javascript
// node
const {loseWeight} = require('@jkt/lose-weight')
```

或者

``` javascript
/*
  ua
  类似 create-react-app，vue-cli，Angular CLI 等工具创建的前端项目，
  内部一般都有 babel 提供支持
 */
import {loseWeight} from '@jkt/lose-weight'
```

注意：不支持在**全局环境**中引用，如 `window.loseWeight`


## API

### 调用语法

``` javascript
// 第 1 种
loseWeight(source).opt(options).handleBy(handlers)
// 第 2 种
loseWeight(source).handleBy(handlers)
```

### 参数

#### source

source 的类型必须是 `Array`，其中各项类型是自定义对象 `Object`，传参示例如下：

``` javascript
loseWeight(
    // source
    [
      {name: 'Jane', age: 30, sex: 0, level: 1}, 
      {name: 'John', age: 20, sex: 1, level: 0}
    ]
  )
  .opt(options)
  .handleBy(handlers)
```

#### options

options 类型是自定义对象 `Object`，是 source 各项中部分（甚至全部）字段的选项。例如 sex 性别字段的选项是 `['女', '男']`；level 等级字段的选项为 `['新手', '普通', '专家']`；传参示例如下：

``` javascript
loseWeight(
    // source
    [
      {name: 'Jane', age: 30, sex: 0, level: 1}, 
      {name: 'John', age: 20, sex: 1, level: 0}
    ]
  )
  .opt(
    // options
    {
      sex: ['女', '男'], // 性别
      level: ['新手', '普通', '专家'] // 等级
    }
  )
  .handleBy(handlers)
```

注意：options 中的 key（即示例中 sex 和 level）和 source 各项中的某字段名对应。从“调用语法”的第 2 种来看，也可以不链式调用 opt，意味着无需字段选项！


#### handlers

handlers 类型是 Object，其中各字段值可以是 Function 类型或 String 类型。handlers 的字段名必须与 source 各项中的某字段名对应

##### 如果字段值是 Function 类型

传参示例如下：

``` javascript
loseWeight(
    // source
    [
      {name: 'Jane', age: 30, sex: 0, level: 1}, 
      {name: 'John', age: 20, sex: 1, level: 0}
    ]
  )
  .opt(
    // options
    {
      sex: ['女', '男'], // 性别
      level: ['新手', '普通', '专家'] // 等级
    }
  )
  .handleBy(
    {
      // ...handlers
      sex(value, options) {
        return options ? options[value] : value
      },
      level(value, options) {
        return options ? options[value] : value
      }
    }
  )
```

字段处理方法在调用时，会传入 2 个参数：

1. 第 1 个（示例中的 value）是 source 某项中某个字段的值
2. 第 2 个可选，默认值 undefined（示例中的 options）是当前字段的选项

    例如 source 某项中某个字段名为 level，且通过链式调用 opt 传递了 level 这个字段的选项，那么在相应字段处理函数中第 2 个参数即为 `['新手', '普通', '专家']`

注意：本工具的用户，必须自行判断 options 的可用性，在没有传递相应字段选项，且未检查字段选项可用性的情况下，使用参数 options 会导致运行时抛出异常！


##### 如果字段值是 String 类型

这个字段名与 source 各项中的某个字段名对应，字段值一般来说和字段名相同，但至少保证是 String 类型。示例如下：

``` javascript
loseWeight(
    // source
    [
      {name: 'Jane', age: 30, sex: 0, level: 1}, 
      {name: 'John', age: 20, sex: 1, level: 0}
    ]
  )
  .handleBy(
    {
      // ...handlers
      name : 'name',
      age: 'age'
    }
  )
```

注意：再次提醒，字段值一般来说和字段名相同，但至少保证是 String 类型！


##### 如果字段值是 Function 类型和 String 类型的混合

示例如下：

``` javascript
loseWeight(
    // source
    [
      {name: 'Jane', age: 30, sex: 0, level: 1}, 
      {name: 'John', age: 20, sex: 1, level: 0}
    ]
  )
  .opt(
    // options
    {
      sex: ['女', '男'], // 性别
      level: ['新手', '普通', '专家'] // 等级
    }
  )
  .handleBy(
    {
      // ...handlers
      name: 'name',
      level(value, options) {
        return options ? options[value] : value
      }
    }
  )
```

### 返回值

类型是 Array，其中各项类型为自定义对象 `Object`，自定义对象的字段名即 handlers 里字段处理函数的名字或字符串的值，示例如下：

``` javascript
[
  { name: 'Jane', level: '普通' }, 
  { name: 'John', level: '新手' } 
]
```


## 参与贡献

### 不写代码

- 报告 api 使用问题
- 报告文档中语病，用词不当，示例错误，描述不详等问题
- 改进建议或新需求提议（需要 FT 组讨论和决议）

通过源代码仓库的 issue 来提交

### 写代码

- 修复 api 使用问题
- 修缮文档
- 实现改进建议或新需求提议（需要 FT 组讨论和决议）

#### 要求

- 单个缩进必须是 2 个空格
- 标识符采用驼峰式命名
- 必须尽可能的“望文生义”
- 除了内建对象，标准对象，以及利用 curry （柯里化）机制，禁止跨作用域查询变量

如果缩进的要求不符合贡献者编码的习惯，请贡献者利用其他手段来保证这个缩进要求，比如 prettier 这个工具。

源代码仓库中的 master 分支是默认 clone 分支，不是发布分支。release 分支是发布分支，总是对应于最新的发布版本。贡献者应该基于该分支签出新分支来贡献代码。在 test 文件夹里写测试用例，在 test/index.js 里引用测试用例并运行，测试 ok 后将代码 push 到源代码仓库，发送 merge request 给 maintainer。maintainer 审查代码，ok 后合并到 release 分支，并发布新版本！

发布的版本，必须在源代码仓库里有对应的标签 `tag` 存在！

注意：任何与贡献要求有冲突的地方，可以在 FT 组内讨论和决议！


## 更新概要

- 1.0.11 剔除无用段落
- 1.0.10 修缮文档用词
- 1.0.9 修缮错误提示，修缮文档
- 1.0.8 修正文档用词
- 1.0.7 修复代码 bug，更正错误提示，修正提示方法
- 1.0.6 修正 API 锚点链接
- 1.0.5 添加环境要求说明，更新文档
- 1.0.4 删除无用注释
- 1.0.3 修复 handlers 中函数项的函数名被前端代码压缩工具处理后，函数名被混淆，无法通过 `函数.name` 获取期望的函数名
