/*
  source 必须是可迭代的，且允许是一个树结构
  handlers 的类型是 function 或 string 或 function 和 string 的混合数组

  Rest parameter
*/

function loseWeight(source) {

  function validateSource(source) {
    const errors = [
      'source 的类型要求是 Array！',
      'source 不能为空数组！'
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
  
    return true
  }

  function handleByCurry(collection) {

    return function handleBy(...handlers) {

      function validateHandlers(handlers) {
        const errors = [
          'handlers 长度为 0，意味着 source 无需处理！'
        ]
        if(handlers.length === 0) {
          console.error(errors[0])
          return false
        }
        
        return true
      }
  
      if(!validateHandlers(handlers)) {
        return
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
                  resultItem[fieldName] = arg(sourceItem[fieldName], (collection.fieldsOptions || {})[fieldName] )
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
  
      return collection.source.reduce(reduceCallbackCurry(handlers), [])
      
    }
  }

  function optCurry(collection, handleBy) {
    return function opt(fieldsOptions) {
      collection.fieldsOptions = fieldsOptions
      return {
        handleBy
      }
    }
  }

  function noop() {}

  const collection = {
    source: null,
    fieldsOptions: null
  }

  if(!validateSource(source)) {
    return {
      opt() {
        return {
          handleBy: noop
        }
      },
      handleBy: noop
    }
  }
  
  collection.source = source
  const handleBy = handleByCurry(collection)

  return {
    opt: optCurry(collection, handleBy),
    handleBy
  }
}

// 导出一个包含 loseWeight 方法的对象
exports.loseWeight = loseWeight
// 直接导出一个 loseWeight 函数
// module.exports = loseWeight

