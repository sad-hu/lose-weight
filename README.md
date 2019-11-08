# lose-weight

## 术语

- 有效字段

  指那些接口返回的数据中，前端需要这些字段在视图层用作展示，或者在表单中用作用户数据的提交。

- 无效字段

  指那些接口返回的数据中，前端不需要这些字段在视图层用作展示，或者不需要在表单中用作用户数据的提交。


## 项目起源

在实际项目中，接口返回的数据，其中无效字段有多又少。对于那些无效字段多，或者需要格式化的有效字段多，或者两种情况兼具的接口返回数据，本工具在以下方面带来收益：

- 将有效字段的提取（解构）和格式化代码集中放在一起（本工具不会修改接口返回的数据）。


## 环境要求

在用户代理 ua（以下简称 ua） 运行时环境；

- 需要有内建对象 JSON
- 需要支持 Array.isArray api
- 需要支持 Array.prototype.reduce api
- function 需要支持 rest parameter
- console.log api 需要支持字符串替换

在 nodejs 运行时环境：

- nodejs 需要较新（当前版本的上一个主要版本）的 lts 版（长期支持版）

注意：在 ua 中（包含 pc 浏览器端，手持设备浏览器端，pc 或手持设备或一些 app 的 webview 端等）。如果是使用项目创建工具（如：create-react-app，vue-cli，Angular CLI 等类似工具）生成的项目，开发过程中，引用这个工具时，不用担心运行时环境要求。在构建时通常也会转译成兼容 ua 的代码。

## 使用（暂时无法如描述使用，仍在 review 文档和进行测试中）

### 在项目中安装

``` bash
# 如果是在 windows 中，可能是这样的
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

```
loseWeight(source).opt(options).handleBy(...handlers)
loseWeight(source).handleBy(...handlers)
```

### 参数

#### source

source 的类型必须是 Array，其中的项必须是自定义对象，示例如下：

``` javascript
loseWeight(
    [
      {name: 'Jane', sex: 0, level: 1}, 
      {name: 'John', sex: 1, level: 0}
    ]
  )
  .opt(options)
  .handleBy(...handlers)
```

注意：source 中各项的字段名应避开 javascript 中的保留字！

#### options

options 类型是个自定义对象，是 source 各项中部分（甚至全部）字段的选项。例如 sex 性别字段值为 1，性别字段的选项是 `['女', '男']`；level 等级字段值为 0，选项为 `['新手', '普通', '专家']`；传参的格式如下：

``` javascript
loseWeight(
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
  .handleBy(...handlers)
```

注意：options 中的 key（`sex` 和 `level`）和 source 各项中的字段名对应。从第二种调用语法来看，也可以不链式调用 opt，意味着无需字段选项！


#### handlers（rest parammeter）

handlers 类型是数组，其中各项可以是 function 类型或 string 类型

##### 如果项是 function 类型

这个 function 作为字段处理函数，必须具名，且名称与 source 各项中的字段名对应，示例如下：

``` javascript
loseWeight(
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
    // ...handlers
    function sex(value, options) {
      return options[value]
    },
    function level(value, options) {
      return options[value]
    }
  )
```

字段处理函数在调用时，会传入 2 个参数：

1. 第 1 个（示例中的 value）是 source 中某项字段的值
2. 第 2 个可选，默认值 undefined（示例中的 options）是当前字段的选项

    例如 source 中某项的字段名为 level，且传递了 level 这个字段的选项，那么在字段处理函数中第 2 个参数即为 `['新手', '普通', '专家']`

注意：假如字段名是 javascript 保留字，例如 `function class(value, options) {}`，运行时会抛出异常或得到非预期的结果，所以前面说注意 source 各项中的字段名，应该避开 javascript 保留字。本工具的用户，必须自行判断 options 的可用性，在没有传递相应字段选项的情况下，使用参数 options 会在运行时抛出异常！


##### 如果项是 string 类型

这个字符串的值与 source 各项中的字段名对应，示例如下：

``` javascript
loseWeight(
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
    // ...handlers
    'name',
    'age'
  )
```

##### 如果是混合 function 类型的项和 string 类型的项

示例如下：

``` javascript
loseWeight(
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
    // ...handlers
    'name',
    function level(value, options) {
      return options ? options[value] : value
    }
  )
```

### 返回值

类型是 Array，其中各项类型为自定义对象，自定义对象的字段名即 handlers 里字段处理函数的名字或字符串的值，示例如下：

``` javascript
[
  { name: 'Jane', level: '普通' }, 
  { name: 'John', level: '新手' } 
]
```


## 参与贡献

### 不写代码

- 报告 api 使用问题
- 报告文档中语病，术语等用词不当，示例错误，描述不详等问题
- 改进建议或新需求提议（需要 FT 组讨论决议）

通过源代码仓库的 issue 来提交

### 写代码

- 修复 api 使用问题
- 修缮文档
- 实现改进建议或新需求提议

#### 要求

- 缩进必须是 2 个空格的长度
- 标识符采用驼峰式命名
- 必须尽可能的“望文生义”
- 除了内建对象和利用 curry （柯里化）机制，禁止跨作用域查询变量

如果缩进的要求不符合贡献者的习惯，请贡献者利用其他手段来保证这个缩进要求，比如 prettier 这个工具。

源代码仓库中的 master 分支是默认 clone 分支，不是发布分支。release 分支是发布分支，总是对应于最新的发布版本。贡献者应该基于该分支签出新分支来贡献代码。在 test 文件夹里写测试用例，在 test/index.js 里引用测试用例并运行，测试 ok 后 push 到源代码仓库，发送 merge request 给 maintainer。maintainer 审查代码，ok 后并合并到 release 分支，并发布新版本！

注意：没有 release 分支意味着仍在`开发中`。任何与贡献要求有冲突的地方，可以在 FT 组内讨论和决议！
