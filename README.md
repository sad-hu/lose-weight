# lose-weight

:heavy_exclamation_mark: 2.0.0 文档撰写中

:heavy_exclamation_mark: 旧版文档请访问 [1.x](https://github.com/sad-hu/lose-weight/tree/1.x)

> :heart: 这是我在公司前端组里写的一个工具，最开始只是为了方便大家处理部分接口返回的数组类型数据，后来做了点扩展，支持对象类型的数据。数据的来源也不再限于接口，支持引入文件或其他任何形式得到的数据。

:heavy_exclamation_mark: 这是一个可选的工具，通过了解将要处理的数据结构和快速浏览本文档，权衡各种需求后，再确定使用该工具可以带来明显收益！

- [起源](#起源)
- [特色](#特色)
- [环境要求](#环境要求)
- [安装](#安装)
- [案例](#案例)
- [API](#api)
- [参与贡献](#参与贡献)
- [更新概要](#更新概要)


## 起源

在实际项目中，请求接口得到的数据，引入文件（包，组件，工具或任何可被引入的东西）得到的数据，或其他任何形式得到的数据。其中的字段有些直接可用，有些需要加工后使用，有些需要重命名后使用，有些可以完全忽略。我们需要解构这些数据，期间按需对字段加工（如：使用 moment 对时间戳进行格式化）或重命名，如果是以数组形式组织的数据，还得循环解构。完成这些工作的代码一般来说不够聚拢！


## 特色

- 可以处理数组类型的数据和对象类型的数据
- 可以是任何形式产生的（常见的如：接口返回，引入文件）数据，只要符合上述类型要求
- 可以将解构，重命名，数据加工代码聚拢在一起


## 环境要求

在用户代理（以下简称 ua） 运行时环境；

- 需要支持 rest parameters（剩余参数）
- 需要支持 Array.isArray api
- 需要支持 Array.prototype.map api
- 需要支持 Array.prototype.reduce api
- 需要支持 Function.prototype.bind api

在 nodejs 运行时环境：

- nodejs 需要较新（当前版本的上一个主要版本）的 lts 版（长期支持版）

 :heavy_exclamation_mark: 在 ua 中（包含 pc 浏览器端，手持设备浏览器端，pc 或手持设备或一些 app 的 webview 端等）。如果是使用项目创建工具（如：create-react-app，vue-cli，Angular CLI 等类似工具）生成的项目，开发过程中，引用这个工具时，不用担心运行时环境要求（那些项目创建工具内部一般都有 babel）。在构建时通常也会转译成兼容 ua 的代码。


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

:heavy_exclamation_mark: 不支持在**全局环境**中引用，如 `window.loseWeight` 或 `window.choose`，`window.assist`


## 案例

### 案例 1

``` javascript
/* import someApi from 'somePackage' */
import {choose} from '@jkt/lose-weight'
import discoveryModel from "models/discovery";

/* class某某某... */

export default connect(
  // mapStateToProps
  ({discovery}) => ({...discovery}),
  // mapDispatchToProps
  choose(
    'getIndex',
    'getList', 
    'resetIndex', 
    'resetList', 
    'setKeyword', 
    'setListHasMore', 
    'setPageStart'
  ).from(discoveryModel.actions),
  /* 原来的写法
  {
    getIndex: discoveryModel.actions.getIndex,
    getList: discoveryModel.actions.getList,
    resetIndex: discoveryModel.actions.resetIndex,
    resetList: discoveryModel.actions.resetList,
    setKeyword: discoveryModel.actions.setKeyword,
    setListHasMore: discoveryModel.actions.setListHasMore,
    setPageStart: discoveryModel.actions.setPageStart,
  } 
  */
)(Layout(Discovery));
```

这是一个普通的使用 redux 的 react 组件的一小部分代码。`mapStateToProps` 中的 `discovery` 里所有的 `state` 都在当前组件的 `this.props` 里了，用到的或没用到的。 `mapDispatchToProps` 使用本工具代替了原来的写法。


### 案例 2

``` javascript
import {choose} from '@jkt/lose-weight'
import commonModel from "models/commonModel";
import resumeModel from "models/resumeModel";
import positionModel from "models/positionModel";
/*
  class某某某...
  batchAllCheck = e => {
    let { positionLists, setUpdateState } = this.props;
    let { checked } = e.target;
    positionLists.list.map(item => {
      item.checked = checked;
      return item;
    });
    
    setUpdateState({
      filed: "positionLists",
      value: positionLists
    });
  };
 */
export default connect(
  ({ position, user }) => {
    return {
      ...position,
      userInfo: user.userInfo,
      complate: user.complate
    };
  },
  // mapDispatchToProps
  { ...commonModel.actions, ...resumeModel.actions, ...positionModel.actions }
  /* 我会使用的写法
    {
      setUpdateState: commonModel.actions.setUpdateState,
      positionLists: positionModel.actions.positionLists,
      resumeComplate: resumeModel.actions.resumeComplate,
      // 其他的 dispatch
    }
    用本工具不是不可以
    // 明确 dispatch 来自哪里，但是写法繁琐
    {
      // 以下操作可能需要 babel 提供 ... 操作符支持
      ...choose('setUpdateState').from(commonModel.actions),
      ...choose('positionLists').from(positionModel.actions),
      ...choose('resumeComplate').from(resumeModel.actions),
      // 其他 dispatch
    }
    也可以
    // 不明确 dispatch 来自哪里，但是写法简单
    choose(
      'setUpdateState',
      'positionLists',
      'positionLists'
    ).from({
      // 以下操作可能需要 babel 提供 ... 操作符支持
      ...commonModel.actions,
      ...positionModel.actions,
      ...resumeModel.actions,
      // 其他 dispatch 的来源
    })
   */
)(Layout(Position));
```

这还是一个普通的使用 redux 的 react 组件的一小部分代码。`mapDispatchToProps` 里这么多 `dispatch` 放 `this.props` 里？我敢打赌大多数并没用到。代码中来一个 `setUpdateState`（注释中的代码 `class某某某..` 里面），也许是在 `commonModel.actions` 里，我不确定，因为这个代码不是我写的:disappointed_relieved:，这里当然可以用本工具，但是建议权衡后按需使用本工具！


### 案例 3

``` javascript

<template>
  <div>
    <!-- 略 -->
    <div id="insurance-pane" class="plr30">
      <!-- 略 -->
      <div class="data-table">
        <el-table :data="insurance.list">
          <el-table-column
            fixed
            prop="name"
            label="姓名"
            :min-width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="jobNumber"
            label="工号"
            :min-width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号"
            :min-width="130"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
            :formatter="sexfmt">
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="部门"
            :min-width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位"
            :min-width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="staffStatus"
            label="员工状态"
            :formatter="stafffmt"
            :min-width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="dateOfEntry"
            label="入职日期"
            :formatter="datefmt"
            :min-width="120"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="insuredProvince"
            label="社保城市"
            :min-width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <!-- 操作略 -->
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页略 -->
      <!-- 组件略 -->
    </div>
  </div>
</template>
<script>
/*
 * import someApi from 'somePackage'
 */
import {choose, assist} from '@jkt/lose-weight'

export default {
  data() {
    return {
      /* 数据略 */
    }
  },
  methods: {
    sexfmt(r, c) {
      // procedure
    },
    stafffmt(r, c) {
      // procedure
    },
    datefmt(r, c) {
      // procedure
    },
    query(options) {
      this.$http.post('/path/to/data', {...parameters})
        .then(res => {
          res = res.body;
          if(res.code == 200) {
            // this.insurance.list = res.result.list || [];
            // 在这里使用本工具
            this.insurance.list = choose(
              'name',
              'jobNumber',
              'mobile',
              [
                'gender', 
                assist(
                  function(性别字段选项, value) {
                    return newValue // 用新别字段选项处理过的 value
                  },
                  undefined, // 这里按需提供 this
                  性别字段选项 // choose 调用前准备好
                )
              ],
              'deptName',
              'position',
              [
                'staffStatus',
                function(员工状态选项, value) {
                  return newValue // 用员工状态选项处理过的 value
                }.bind(this/* 绑定组件实例作为 this */, 员工状态选项/* choose 调用前准备好 */)
              ],
              [
                'dateOfEntry',
                function(moment, value) {
                  return newValue // 用 moment 处理过的 value
                }.bind(this/* 绑定组件实例作为 this */, moment/* choose 调用前准备好 */)
              ],
              'insuredProvince'
            ).from(res.result.list || [])
            
            // 其他操作
          }
        })
        .catch(err => {
          console.log(err.status, err.statusText);
        });
    },
    // 其他各种方法
  },
  mounted() {
    // procedure
  },
  components: {
    /* 组件略 */
  }
}
</script>
<style scoped lang="scss">/* 省略 */</style>

```

这是一个普通的 vue 组件，用了 element-ui 组件后，有 3 个字段需要格式化，分别是 gender，staffStatus，dateOfEntry，格式化函数定义在组件中的 methods 对象中。可以使用本工具把字段解构和格式化放在一起，参看上例 `query` 中的调用 `choose(key, key2, key3, ...).from(source)`，这样就不再需要在 `el-table-column` 中出现 `:formatter="***fmt"`。


## API

### 调用语法

词汇表：

- 字段名 -> key, key1, key2, ...
- 新字段名（用于替换旧有字段名） -> nweKey, newKey1, newKey2, ...
- 字段值 -> value, value1, value2, ...
- 新的字段值 -> newValue, newValue1, newValue2, ...
- 字段处理函数 -> handle
- 函数内部过程 -> procedure
- 返回 -> return
- 参数 -> parameters
- this 参数 -> thisArg
- 字段选项 -> option, option1, option2, ...
- 外部工具 -> tool, tool1, tool2, ...
- 待处理数据 -> source
- 接收 source 函数 -> from

``` javascript
const result1 = choose(
  'key1', 
  ['key2', 'newKey2'], 
  [
    'key3', 
    function(value3) {
      /* 
        procedure; 
        return newValue3
       */
    }
  ],
  [
    'key4', 
    function(value4) {
      /* 
        procedure; 
        return newValue4
       */
    }, 
    'newKey4'
  ]
).from([
  {key: 'value', key2: 'value2', key3: 'value3'}, 
  {key: 'value4', key2: 'value5', key4: 'value6'}
])

// 或者
const result2 = choose(
  'key',
  'key3' 
).from({
  key: 'value', 
  key2: 'value2', 
  key3: function(parameters) {
    /* procedure */
  }
})
```
#### choose 参数

必选！类型为 String 或 Array。

如果类型是 Array：

- 第 1 项：必选！类型为 String
- 第 2 项：必选！类型为 String 或 Function
  - 如果类型是 Function：该函数接受一个参数，该参数是对应的字段值
- 第 3 项：可选！类型为 String

#### choose 返回

一个带有 from 方法的对象

#### from 参数

必选！类型为 Array 或 Object。

- 如果类型是 Array，其中的各项会被当作 Object 类型

#### from 返回

类型和其接受的的参数类型对应

``` javascript
const result = choose(
  'key1', 
  ['key2', 'newKey2'], 
  [
    'key3', 
    assist(
      function(option, tool, tool2, value3) {
        /* 
          procedure; 
          return newValue3
        */
      },
      undefined,
      option,
      tool,
      tool2
    )
  ],
  [
    'key4', 
    function(value4) {
      /* 
        procedure; 
        return newValue4
       */
    }, 
    'newKey4'
  ]
).from([
  {key: 'value', key2: 'value2', key3: 'value3'}, 
  {key: 'value4', key2: 'value5', key4: 'value6'}
])
```

#### assist 参数

- 第 1 个：必选！类型为 Function，依赖于第 3 个参数及后续参数
  - 如果第 3 个参数及其后续参数存在，那么他们会按序注入到该函数的参数中
- 第 2 个：必选！this 参数，类型一般为 Object，可传递 undefined
- 第 3 个及后续参数：可选！按需传递，通常是字段选项，字段处理工具（如：moment）

#### assist 返回

类型为 Function，该函数在调用时可再次按需注入参数，那些参数会按序排列在 assist 第 1 个函数参数的参数列表之后

:heavy_exclamation_mark: assist 的内部原理即 [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)


## 参与贡献

### 不写代码

- 报告 api 使用问题
- 报告文档中语病，用词不当，示例错误，描述不详等问题
- 改进建议或新需求提议（需要讨论和决议）

通过源代码仓库的 issue 来提交

### 写代码

- 修复 api 使用问题
- 修缮文档
- 实现改进建议或新需求提议

#### 要求

- 单个缩进必须是 2 个空格
- 标识符采用驼峰式命名
- 必须尽可能的“望文生义”
- 除了内建对象，标准对象，以及利用柯里化（currying）机制，禁止跨作用域变量查询

欢迎大家发送 issue 和 pull request！

:heavy_exclamation_mark: 任何与贡献要求有冲突的地方，可以发 issue 讨论！


## 更新概要
