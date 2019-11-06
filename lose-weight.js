/*
  source 必须是可迭代的，且允许是一个树结构
  handlers 的类型是 function 或 string 或 function 和 string 的混合数组

  Rest parameter
*/

function validateArguments(source, handlers) {
  const errors = [
    'source 的类型要求是 Array！',
    'source 不能为空数组！',
    'handlers 长度为 0，意味着 source 无需处理！'
  ]
  const isArray = Array.isArray(source)
  
  if(!isArray) {
    console.error(errors[0])
    return false
  }

  if(source.length === 0) {
    console.error(errors[1])
    return false
  }

  if(handlers.length === 0) {
    console.error(errors[2])
    return false
  }

  return true

}


function reduceCallbackCurry(handlers) {
  const errors = [
    '不支持匿名函数作为字段处理函数，已忽略！',
    '不支持空字符串 "" 作为字段名，已忽略！',
    '不支持 "%s" 作为字段名，已忽略！'
  ]
  const errorCounter = {}

  return function reduceCallback(accumulator, sourceItem) {
    const resultItem = {}
    // const resultItem = new Map()
    for(const arg of handlers) {
      const t = typeof(arg)
      const fieldName = t === 'function' ? arg.name : arg
      switch(t) {
        case 'function':
          if(fieldName) {
            resultItem[fieldName] = arg(sourceItem[fieldName])
            // resultItem.set(fieldName, arg(sourceItem[fieldName]))
          }else {
            if(!errorCounter[errors[0]]) {
              console.error(errors[0])
              errorCounter[errors[0]] = errors[0]
            }
          }
          break
        case 'string':
          // 暂时将连续空格作为特殊的字段名，加以保留
          // 暂时允许字段名前后端有空格的情况存在
          if(fieldName) {
            resultItem[fieldName] = sourceItem[fieldName]
            // resultItem.set(fieldName, sourceItem[fieldName])
          }else {
            if(!errorCounter[errors[1]]) {
              console.error(errors[1])
              errorCounter[errors[1]] = errors[1]
            }
          }
          break
        case 'number':
          resultItem[fieldName] = sourceItem[fieldName]
          // resultItem.set(fieldName, sourceItem[fieldName])
          break
        default:
          const msg = t === 'symbol' ? arg.toString() : JSON.stringify(arg)
          if(!errorCounter[errors[2] + msg]) {
            console.error(errors[2], msg)
            errorCounter[errors[2] + msg] = errors[2] + msg
          }
          break
      }
    }

    /* if(resultItem.size > 0) {
      accumulator.push(Object.fromEntries(resultItem))
      // console.log('Array.from(resultItem)', Array.from(resultItem))
      accumulator.push(resultItem)
    } */

    if(Object.keys(resultItem).length > 0) {
      accumulator.push(resultItem)
    }

    return accumulator
  }
}

function loseWeight(source, ...handlers) {
  
  // 以上是参数验证
  if(!validateArguments(source, handlers)) {
    return
  }
  
  // 暂时有效的 sourceItem 类型是 object
  return source.reduce(reduceCallbackCurry(handlers), [])

}

// 导出一个包含 loseWeight 方法的对象
exports.loseWeight = loseWeight
// 直接导出一个 loseWeight 函数
// module.exports = loseWeight

