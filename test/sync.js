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
