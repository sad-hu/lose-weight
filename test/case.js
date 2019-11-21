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
      {
        '姓名': function(item) {
          if(item) return `username：${item.value[0]}`
          return undefined
        },
        age(value) {
          if(value) return `${value}岁`
          return undefined
        },
        // function birth(item, options) {
        //   // console.log('birth item, options', item, options)
        //   if(item) return `生日：${item}`
        //   return undefined
        // },
        [{}]: {},
        [null]: null,
        [Symbol()]: Symbol(),
        [false]: false,
        [undefined]: false,
        0: 0,
        '[{}]': '[{}]',
        100: 100,
        [function() {}]: function() {},
        '': '',
        '    ': '    ',
        ' blank  ': ' blank  ',
        sex(value, options) {
          // console.log('sex item, options', item, options)
          // return `gender${item}`
          if(typeof(value) === 'number') {
            return options[value]
          }
          return undefined
        }
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
  {
    sex(value, options) {
      return options[value]
    },
    level(value, options) {
      return options[value]
    }
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
  {
    // 在不传递 options 的情况下，字段处理函数需要自行判断 options 的可用性
    sex(value, options) {
      return options ? options[value] : value
    },
    level(value, options) {
      return options ? options[value] : value
    }
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
    {
    // 在不传递 options 的情况下，字段处理函数需要自行判断 options 的可用性
      name: 'name',
      age: 'age'
    }
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
    {
      // ...handlers
      name: 'name',
      level(value, options) {
        return options ? options[value] : value
      }
    }
  )
)
