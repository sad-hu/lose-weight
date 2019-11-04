/* const {loseWeight} = require('../../lose-weight')

async function fa() {
  const rt = await [1, 2, 3].reduce(async function(a, n) {
    const promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        if(n === 2) {
          reject(n)
        }else {
          resolve(n * n)
        }
        // resolve(n * n)
      }, 1200)
    })
    const item = await promise.catch(function(e) {
      console.log('e', e)
    })
    const out = await a
    item && out.push(item)
    return out
  }, [])
  console.log('rt', rt)
}
fa()
console.log('loseWeight', loseWeight.name) */

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
    ' blank  ': 'blank'
  }
]

function loseWeightAsync(source, ...args) {
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
    return async function fn1(accumulator, item) {
      const out = {}
      for(const arg of args) {
        const t = typeof(arg)
        const fieldName = t === 'function' ? arg.name : arg
        switch(t) {
          case 'function':
            if(fieldName) {
              out[fieldName] = await arg(item[fieldName])
              console.log('fieldName', fieldName)
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
      accumulator = await accumulator
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

(async () => {
  const rt = await loseWeightAsync(
    source,
    async function 姓名(item) {
      // return item.value[0]
      const promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(`${item.value[0]}称呼`)
        }, 1200)
      })
      return await promise.then()
    },
    async function age(item) {
      const promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(`${item}岁`)
        }, 1200)
      })
      return await promise.then()
    },
    async function birth(item) {
      const promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(`${item}生日`)
        }, 1200)
      })
      return await promise.then()
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
})()


// (async function() {
//   const rt = await [1, 2, 3].reduce(async function(a, item, idx) {
//     a = await a
//     console.log(idx)
//     a.push(item + '0')
//     return a
//   }, [])
//   console.log('rt', rt)
// })()
