# lose-weight

## 这是 2.0.0-beta 版

:loudspeaker: 旧版文档请访问 [1.x](https://github.com/sad-hu/lose-weight/tree/1.x)

> :heart: 这是我在公司前端组里写的一个工具，最开始只是为了方便处理接口返回的数组类型数据，后来做了点扩展，增加了对象类型数据的支持。数据的来源也不仅限于接口，支持引入文件或其他任何形式得到的数据。

:heavy_exclamation_mark: 这是一个可选的工具，通过了解将要处理的数据结构和本文档，权衡各种因素后，再确定是否使用该工具！在实际工作中，请求接口得到的数据，引入文件（包，组件，工具或任何可被引入的东西）得到的数据，或其他任何形式得到的数据。其中的字段有些直接可用，有些需要加工后使用，有些需要重命名后使用，有些可以完全忽略。我们需要解构这些数据，期间按需对字段加工（如：使用 moment 对时间戳进行格式化）或重命名，如果是以数组形式组织的数据，还得循环解构。完成这些工作的代码量有时并不少，或许散落在各处，有时字段的出处难以明确！一般来说通过在接口处，引入文件处或任何生成数据的地方施加控制（如：约定），或者将原来的代码进行重构乃至重写，就能解决问题，至少是大大缓解问题。

- [特色](#特色)
- [环境要求](#环境要求)
- [安装](#安装)
- [案例](#案例)
- [API](#api)
- [参与贡献](#参与贡献)
- [更新概要](#更新概要)


## 特色

- 可以处理数组类型和对象类型的数据；任何途径或形式产生的（如：接口返回，引入文件等）数据，只要符合类型要求；
- 可以将解构，重命名，数据加工代码聚拢在一起。


## 环境要求

在用户代理（以下简称 ua） 运行时环境；

- 需要支持 rest parameters（剩余参数）
- 需要支持 Array.isArray api
- 需要支持 Array.prototype.map api
- 需要支持 Array.prototype.reduce api
- 需要支持 Function.prototype.bind api

在 nodejs 运行时环境：

- nodejs 需要较新（当前版本的上一个主要版本）的 lts 版（长期支持版）

 :heavy_exclamation_mark: 在 ua 中（包含 pc 浏览器，手持设备浏览器，pc 或手持设备或一些 app 的 webview 端等）。如果是使用项目创建工具（如：create-react-app，vue-cli，Angular CLI 等类似工具）生成的项目，开发过程中，引用这个工具时，不用担心运行时环境要求（那些项目创建工具内部一般包含 babel）。在构建时通常也会转译成兼容 ua 的代码。


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
// ua
/*
  类似 create-react-app，vue-cli，Angular CLI 等工具创建的前端项目，
  内部一般都有 babel 提供支持
 */
import {choose, assist} from '@jkt/lose-weight'

// 或者
import * as loseWeight from '@jkt/lose-weight'
// loseWeight.choose
// loseWeight.assist
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

这是一个普通的使用了 redux 的 react 组件的一小部分代码。`mapStateToProps` 中的 `discovery` 里所有的 `state` 都在当前组件的 `this.props` 里了，不管是用到的或没用到的。 `mapDispatchToProps` 使用本工具代替了原来的写法。


### 案例 2

``` javascript
/* import someApi from 'somePackage' */
import {choose} from '@jkt/lose-weight'
import commonModel from "models/commonModel";
import resumeModel from "models/resumeModel";
import positionModel from "models/positionModel";

  class 某茉某 extend 某某 {
    //...
    batchAllCheck = e => {
      // setUpdateState 出处也许要逐一查看引入的文件才能明确
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
    //...
  }
 
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

  // 我使用的写法
  /*
  {
    setUpdateState: commonModel.actions.setUpdateState,
    positionLists: positionModel.actions.positionLists,
    resumeComplate: resumeModel.actions.resumeComplate,
    // 其他 dispatch
  }
  */

  // 用本工具不是不可以
  // 明确 dispatch 来自哪里
  /*
  {
    ...choose('setUpdateState').from(commonModel.actions),
    ...choose('positionLists').from(positionModel.actions),
    ...choose('resumeComplate').from(resumeModel.actions),
    // 其他 dispatch
  }
  */

  // 也可以不明确 dispatch 来自哪里
  /*
  choose(
    'setUpdateState',
    'positionLists',
    'resumeComplate'
  ).from({
    ...commonModel.actions,
    ...positionModel.actions,
    ...resumeModel.actions,
    // 其他 dispatch 的来源
  })
  */
)(Layout(Position));
```

这还是一个普通的使用了 redux 的 react 组件的一小部分代码。`mapDispatchToProps` 里这么多 `dispatch` 放 `this.props` 里？我敢打赌大多数并没用到。代码中来一个 `setUpdateState`（注释中的代码 `class 某某某` 里面），也许是在 `commonModel.actions` 里，我不确定，因为这个代码不是我写的:disappointed_relieved:，这里当然可以使用本工具，但是建议权衡后按需使用本工具！


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
/* import someApi from 'somePackage' */
import {choose, assist} from '@jkt/lose-weight'
import moment from 'moment'

export default {
  data() {
    return {
      /* 数据略 */
    }
  },
  methods: {
    // 不再需要
    sexfmt(r, c) {
      // procedure
    },
    // 不再需要
    stafffmt(r, c) {
      // procedure
    },
    // 不再需要
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
                // 后续会有 API 说明
                assist(
                  function(性别字段选项, value) {
                    return newValue // 用性别字段选项处理过的 value
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
                }.bind(
                  this, /* 组件实例作为 this */
                  员工状态选项/* choose 调用前准备好 */
                )
              ],
              [
                'dateOfEntry',
                function(moment, value) {
                  return newValue // 用 moment 处理过的 value
                }.bind(
                  this, /* 组件实例作为 this */
                  moment/* choose 调用前准备好 */
                )
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

这是一个普通的 vue 组件，使用了 element-ui，有 3 个字段需要格式化，分别是 `gender`，`staffStatus`，`dateOfEntry`，格式化函数定义在组件的 `methods` 中。可以使用本工具把字段解构和格式化放在一起，参看上例 `query` 中的调用 `choose(/* some keys */).from(/* source */)`，这样就不再需要 `el-table-column` 和 `methods` 中分别出现 `:formatter="***fmt"` 和 `***fmt`。


## API

:sparkles: 灵感源于必应词典 [choose](https://cn.bing.com/dict/search?q=choose) 词条中的例句 `We have to choose a new manager from a shortlist of five candidates.`


### 调用语法

#### 辅助词汇表

- 字段名：key, key2, key3, ...
- 新字段名（用于替换旧有字段名）：nweKey, newKey2, newKey3, ...
- 字段值：value, value2, value3, ...
- 新的字段值（字段值被加工后得到的值）：newValue, newValue2, newValue3, ...
- 函数内部过程：procedure
- 参数：parameters
- this 参数：thisArg
- 字段选项：option, option2, option3, ...
- 工具：tool, tool2, tool3, ...

#### 调用示例

``` javascript
const result1 = choose(
  'key', 
  ['key2', 'newKey2'], 
  [
    'key3', 
    function(value3) {
      /*
        procedure
      */
      return newValue3
    } 
  ],
  [
    'key4', 
    function(value4) {
      /*
        procedure
      */
      return newValue4
    },
    'newKey4'
  ],
  [
    'key5', 
    assist(
      function(option, option2, tool, tool2, value5) {
        /* 
          this.property
          this.method
          procedure; 
        */
        return newValue5
      },
      thisArg,
      option,
      option2,
      tool,
      tool2
    )
  ],
  [
    'key6', 
    // 也可以
    function(option, tool, value6) {
      /* 
        this.property
        this.method
        procedure; 
       */
      return newValue6
    }.bind(
      thisArg,
      option,
      tool
    ), 
    'newKey6'
  ]
).from([
  {key: 'value', key2: 'value2', key3: 'value3', key5: 'value5'}, 
  {key: 'value__', key2: 'value22', key4: 'value4', key6: 'value6'}
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
    return anything
  }
})
```

#### 函数 choose 参数

必选！可接受参数个数不限，单个参数类型为 String 或 Array 或 Number（在工具内部转换成字符串处理）。

如果类型是 Array：

- 第 1 项：必选！类型为 String 或 Number（在工具内部转换成字符串处理）；
- 第 2 项：必选！类型为 String 或 Function 或 Number（在工具内部转换成字符串处理）；
  - 如果类型是 Function，该函数接受 1 个参数，该参数是对应字段的值。并期待本工具的用户返回一个加工后的值。如果在加工过程中需要注入更多的参数（如：字段选项或格式化工具）和绑定 this，请参考后续 `辅助函数 assist` 的说明或直接使用 `Function.prototype.bind` api。
- 第 3 项：可选！类型为 String 或 Number（在工具内部转换成字符串处理）。

#### 函数 choose 返回值

一个带有 from 方法的对象。

#### 方法 from 参数

必选！可接受 1 个参数！类型为 Array 或 Object。

- 如果类型是 Array，其中的各项会被当作 Object 类型来处理。

#### 方法 from 返回值

类型和其接受的的参数类型对应。

#### 辅助函数 assist 参数

- 第 1 个参数：必选！类型为 Function。否则 assist 会返回一个空函数，其中 this 和 parameters 都没有定义。但不会报错！注入该函数的参数依赖于第 3 个参数及后续参数；
  - 如果第 3 个参数及其后续参数存在，那么他们会按序注入到第 1 个函数参数的参数列表中。
- 第 2 个：可选！`this` 参数，类型一般为 Object，需要时，明确指定；
- 第 3 个及后续参数：可选！按需传递，通常是字段选项，字段加工工具（如：moment）。

#### 辅助函数 assist 返回值

类型为 Function，该函数在调用时可按需注入参数，那些参数会按序排列在 assist 第 1 个函数参数的参数列表（如果存在辅助函数 assist 第 3 个参数及后续参数的话）之后（等同于使用 `Function.prototype.bind` api 返回的结果）

:heavy_exclamation_mark: 辅助函数 assist 是个可选使用的函数。在工具内部大量使用，其原理和实现即 [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)。


## 参与贡献

### 不写代码

- 报告 api 使用问题或 bug；
- 报告文档中语病，用词不当，示例错误，描述不详等问题；
- 改进建议或新需求提议（需要讨论和决议）。

通过源代码仓库的 issue 来提交。

### 写代码

- 修复 api 使用问题或 bug；
- 修缮文档；
- 实现改进建议或新需求提议。

#### 代码要求

- 单个缩进必须是 2 个空格；
- 标识符采用驼峰式命名；
- 必须尽可能的“望文生义”；
- 除了内建对象，标准对象，以及利用柯里化（currying）机制，禁止跨作用域变量查询。

欢迎大家发送 issue 和 pull request :clap::thumbsup:

:raising_hand: 任何与贡献要求有冲突的地方，可以发 issue 讨论！


## 更新概要

- 2.0.0-beta.2 修缮文档中版本号文案
- 2.0.0-beta.1 通过初步的测试
- 2.0.0-alpha.5 安装后说明版本差异，提供不同版本的文档
- 2.0.0-alpha.4 更正安装说明
- 2.0.0-alpha.3 修缮文档，更正版本信息
- 2.0.0-alpha.2 修缮文档，更正安装说明
- 2.0.0-alpha.1 相比 1.x，提供更简单的 api，被处理数据除了支持原有的 Array 类型，新增 Object 类型支持，新增字段重命名支持，提供更简单的字段选项和工具注入方式
