const {loseWeight} = require('../lose-weight')

const source = [
  {
    "姓名": {
      "configType": null,
      "value": [
        "jelly"
      ],
      "fileType": "9"
    },
    age: 28,
    birth: '1900-0-0',
    '[{}]': 'nullnull',
    100: 100,
    ' blank  ': 'blank',
    sex: 1
  },
  {x: 'x', y: 'y', z: 'z'}
]

console.log(
  loseWeight(source)
    .opt({sex: ['女', '男']})
    .handleBy(
      function 姓名(item) {
        if(item) return `username：${item.value[0]}`
        return undefined
      },
      function age(item) {
        if(item) return `${item}岁`
        return undefined
      },
      // function birth(item, options) {
      //   // console.log('birth item, options', item, options)
      //   if(item) return `生日：${item}`
      //   return undefined
      // },
      {},
      null,
      Symbol(),
      false,
      undefined,
      0,
      '[{}]',
      100,
      function() {},
      '',
      '    ',
      ' blank  ',
      function sex(item, options) {
        // console.log('sex item, options', item, options)
        // return `gender${item}`
        if(typeof(item) === 'number') {
          return options[item]
        }
        return undefined
      }
    )
)

console.log('original source\n', source)

console.log(loseWeight(
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
  function sex(value, options) {
    return options[value]
  },
  function level(value, options) {
    return options[value]
  }
))

console.log(loseWeight(
  [
    {name: 'Jane', age: 30, sex: 0, level: 1}, 
    {name: 'John', age: 20, sex: 1, level: 0}
  ]
)
.opt(
  // options
  // {
  //   sex: ['女', '男'], // 性别
  //   level: ['新手', '普通', '专家'] // 等级
  // }
)
.handleBy(
  // 在不传递 options 的情况下，字段处理函数需要自行判断 options 的可用性
  function sex(value, options) {
    return options ? options[value] : value
  },
  function level(value, options) {
    return options ? options[value] : value
  }
))

console.log(
  loseWeight(
    [
      {name: 'Jane', age: 30, sex: 0, level: 1}, 
      {name: 'John', age: 20, sex: 1, level: 0}
    ]
  )
  .opt(
    // options
    // {
    //   sex: ['女', '男'], // 性别
    //   level: ['新手', '普通', '专家'] // 等级
    // }
  )
  .handleBy(
    // 在不传递 options 的情况下，字段处理函数需要自行判断 options 的可用性
    'name',
    'age'
  )
)

console.log(
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
)


// const fns = [
//   function a() {
//     return 'a'
//   },
//   function b() {
//     return 'b'
//   }
// ]

// function gofns(...args) {
//   console.log(arguments[0])
// }

// gofns(...fns)

/* 
// 旧实现的测试用例
const rt = thin(
  source,
  // Object, // 如果非要这样 hack，暂时无法有效阻止！
  function 姓名(item) {
    if(item) return `username：${item.value[0]}`
    return undefined
  },
  function age(item) {
    if(item) return `${item}岁`
    return undefined
  },
  function birth(item) {
    if(item) return `生日：${item}`
    return undefined
  },
  {},
  null,
  Symbol(),
  false,
  undefined,
  0,
  '[{}]',
  100,
  function() {},
  '',
  '    ',
  ' blank  '
)

console.log(rt) 

*/
