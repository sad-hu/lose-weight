const {choose, assist} = require('../lose-weight')

function test(cb, ...rest) {
  try {
    return cb(...rest)
  }catch(e) {
    console.log(e.message)
  }
}

const source = [
  {
    [undefined]: 'un de fined'
  },
  {
    a: 'a'
  },
  {
    b: 'b'
  },
  {
    1: 'one'
  }
]
const source2 = {b: 'bb'}

const rt = choose(
    'undefined', 
    [
      'a', 
      assist(
        function(awsl, value) {return value && value + `-made. ${this.omg}, the ${awsl}!`},
        {omg: 'This is the this!'},
        'AWSL'
      ),
      'null',
    ],
    '1'
  )
  .from(source)

const rt2 = choose(
    'undefined', 
    ['a', function(awsl, value) {return value && value + `-made, ${awsl}!`}.bind(undefined, 'AWSL'), 'null']
  )
  .from(source2)

const rt3 = choose('undefined', 'yoyo').from([])

const rt4 = choose('undefined', 'yoyo').from({})

const rt5 = choose('yellow', 'boots').from([{}, {}])


console.log('rt', rt)
console.log('rt2', rt2)
console.log('rt3', rt3)
console.log('rt4', rt4)
console.log('rt5', rt5)

console.log('\n=== test ===\n')

test(choose)
test(choose, undefined)
test(choose, [])
test(choose, '')
test(choose, 'ab')
test(choose, ['a'])
test(choose, ['a', 'b', 'c', 'd'])
test(choose, [null, 'b'])
test(choose, ['a', ''])
test(choose, ['a', []])
test(choose, ['a', ''])
test(choose, ['a', 'b', 'c'])
test(choose, ['a', function() {}, null])
test(choose, ['a', function() {}, ''])
test(choose, ['a', function() {}, 3])
// test(choose, null, undefined)
// test(choose, Symbol('my symbol'))
// test(choose, 'a', 12345) // not ok
// test(choose, 'a', '0')

const rt6 = choose(1, [3, 2]).from([0, 1, 2, 3, 4])
console.log(rt6)

const rt7 = choose(1, [3, function(value) { return value + '[3]'}, 2]).from([0, 1, 2, 3, 4])
console.log(rt7)

/*
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
  {x: 'x', y: 'y', z: 'z', 0: '000'}
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
        [{a: 'a'}]: '{}',
        [null]: null,
        [Symbol('b')]: 'symbol(b)',
        [false]: false,
        [undefined]: false,
        0: 0,
        '[{}]': '[{}]',
        100: 100,
        [function() {}]: function() {},
        '': function(value) {return value},
        // '': '',/
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
*/
