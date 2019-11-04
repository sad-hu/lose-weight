// const source = [
//   {
//     "姓名": {
//       "configType": null,
//       "value": [
//         "jelly"
//       ],
//       "fileType": "9"
//     },
//     age: 28,
//     '[{}]': 'nullnull',
//     100: 100
//   }
// ]

/*
  source 必须是可迭代的，且允许是一个树结构
  args 的类型是 function 或 string 或 function 和 string 的混合数组
*/
function loseWeight(source, ...args) {
  const isArray = Array.isArray(source)
  let sourceLength = 0
  const argsLength = args.length

  if(isArray) {
    sourceLength = source.length
  }

  // 暂时有效的 source 类型是 array
  if(!isArray || sourceLength === 0) {
    console.log('source 的类型要求是 Array！且长度不为 0')
    return
  }

  if(argsLength === 0) {
    console.log('args 参数长度为 0，意味着数据无需处理！')
    return
  }

  // 以上是参数验证

  // 核心累加器
  const cb = (function iife1(args) {
    return function fn1(accumulator, item) {
      const out = {}
      for(const arg of args) {
        const t = typeof(arg)
        const fieldName = t === 'function' ? arg.name : arg
        switch(t) {
          case 'function':
            if(fieldName) {
              out[fieldName] = arg(item[fieldName])
            }else {
              console.log(`不支持匿名函数作为字段处理函数，已忽略！`)
            }
            break
          case 'string':
            // 暂时将连续空格作为特殊的字段名，加以保留
            // 暂时允许字段名前后端有空格的情况存在
            if(fieldName) {
              out[fieldName] = item[fieldName]
            }else {
              console.log(`不支持空字符串 "${fieldName}" 作为字段名，已忽略！`)
            }
            break
          case 'number':
            out[fieldName] = item[fieldName]
            break
          default:
            const msg = t === 'symbol' ? arg.toString() : JSON.stringify(arg)
            console.log(`不支持 ${msg} 作为字段名，已忽略！`)
            break
        }
      }
      if(Object.keys(out).length > 0) {
        accumulator.push(out)
        return accumulator
      }else {
        return accumulator
      }
    }
  })(args)

  // 暂时有效的 item 类型是 object
  return source.reduce(cb, [])
}

// 导出一个包含 loseWeight 函数的对象
exports.loseWeight = loseWeight
// 直接导出一个 loseWeight 函数
// module.exports = loseWeight


// const rt = imap(
//   source,
//   function 姓名(item) {
//     return item.value[0]
//   },
//   'age',
//   {},
//   null,
//   Symbol(),
//   false,
//   undefined,
//   0,
//   '[{}]',
//   100,
//   function() {},
//   '',
//   '    '
// )

// console.log(rt)

// console.log(typeof(Symbol()))
