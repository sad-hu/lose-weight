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

    return function handleBy(handlers) {

      function validateHandlers(handlers) {
        const errors = [
          'handlers 为 undefined 意味着 source 无需被处理',
          'handlers 的类型必须是 object',
          'handlers 里未包含字段处理方法，意味着 source 无法被处理'
        ]

        if(!handlers) {
          console.error(errors[0])
          return false
        }

        if(typeof(handlers) !== 'object') {
          console.log(errors[1])
          return false
        }

        if(Object.keys(handlers).length === 0) {
          console.log(errors[2])
          return false
        }
        
        return true
      }
  
      if(!validateHandlers(handlers)) {
        return
      }
  
      function reduceCallbackCurry(handlers) {
        const errors = [
          '不支持空字符串 "" 作为字段处理方法名，已忽略！',
          '不支持空字符串 "" 作为字段名，已忽略！'
        ]
        const errorCounter = {}
      
        return function reduceCallback(accumulator, sourceItem) {
          const resultItem = {}
          const keys = Object.keys(handlers)
          
          for(const fieldName of keys) {
            const fieldValueType = typeof(handlers[fieldName])
            switch(fieldValueType) {
              case 'function':
                if(fieldName) {
                  resultItem[fieldName] = handlers[fieldName](
                    sourceItem[fieldName], 
                    (collection.fieldsOptions || {})[fieldName]
                  )
                }else {
                  if(!errorCounter[errors[0]]) {
                    console.error(errors[0])
                    errorCounter[errors[0]] = errors[0]
                  }
                }
                break
              default:
                if(fieldName) {
                  resultItem[fieldName] = sourceItem[fieldName]
                }else {
                  if(!errorCounter[errors[1]]) {
                    console.error(errors[1])
                    errorCounter[errors[1]] = errors[1]
                  }
                }
                break;
            }
          }
      
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

