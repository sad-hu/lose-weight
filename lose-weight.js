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
    '[{}]': 'nullnull',
    100: 100
  }
]

/*
  source 必须是可迭代的，且允许是一个树结构
  args 的类型一般是 function 或 string 集合，如果处于集合的某项既不是 function 也不是 string，那么这个 arg 作为 string 一样处理
*/
function imap(source, ...args) {
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
            out[fieldName] = arg(item[fieldName])
            break
          // 以下写法据说老版本的 js 引擎有人提交过 bug
          // 但是在最近（2019年）看到过这样的写法
          // 意思是 string 和 number 类型都能满足
          case 'string':
          case 'number':
            out[fieldName] = item[fieldName]
            break
          default:
            console.log(`不支持 ${JSON.stringify(arg)} 作为字段名，已忽略！`)
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

const rt = imap(
  source,
  function 姓名(item) {
    return item.value[0]
  },
  'age',
  {},
  null,
  Symbol(),
  false,
  undefined,
  0,
  '[{}]',
  100,
  function() {}
)

console.log(rt)
