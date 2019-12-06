'use strict'

function assist(fn, thisArg, ...restParameters) {
  return fn.bind(
    thisArg,
    ...restParameters
  )
}

function throwError(description) {
  throw new Error(description)
}

const prepareParameters = assist(
  function(throwError, parameters) {
    if(parameters.length === 0) {
      throwError('[ERROR] 函数 choose 的参数长度必须大于 0！')
    }

    const types1 = ['string', 'array']
    const types2 = ['string', 'function']

    const collection = parameters.map(function(item, index) {
      const type = Array.isArray(item) ? 'array' : typeof(item)
      if(types1.indexOf(type) === -1 || item.length === 0) {
        throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型必须为 String 或 Array！且其长度必须大于 0！`)
      }else if(type === 'array') {
        if(item.length < 2 || item.length > 3) {
          throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的长度必须大于 1，且小于 4！`)
        }else {
          const type0 = typeof(item[0])
          if(type0 !== 'string' || item[0].length === 0) {
            throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 1 项类型必须为 String, 其长度必须大于 0！`)
          }
          const type1 = typeof(item[1])
          if(
            types2.indexOf(type1) === -1
            || (type1 === 'string' && item[1].length === 0)
          ) {
            throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 2 项类型必须为 String 或 Function, 如果其类型为 String 那么其长度必须大于 0！`)
          }

          if(item.length === 3) {
            if(type1 === 'string') {
              throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 2 项类型已经为 String, 因此第 3 项禁止存在！`)
            }else if(
              typeof(item[2]) !== 'string'
              || item[2].length === 0
            ) {
              throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 3 项类型必须为 String, 且长度必须大于 0！`)
            }
          }
        }
      }
      return item
    })
    
    return collection
  },
  undefined,
  throwError
)

const prepareSource = assist(
  function(throwError, source) {
    const type = Array.isArray(source) ? 'array' : typeof(source)
    if(
      ['array', 'object'].indexOf(type) === -1
      || (type === 'array' && source.length === 0) 
      || (type === 'object' && Object.keys(source).length === 0)
    ) {
      throwError('[ERROR] 函数 from 的参数类型必须是 Array 或 Object（可枚举），如果类型是 Array，其长度必须大于 0；如果是 Object，其可枚举属性的个数必须大于 0！')
    }

    return {
      type,
      source
    }
    
  },
  undefined,
  throwError
)

function main(prepareParameters, assist, prepareSource, ...parameters) {

  console.log('main this', this)

  const preparedParameters = prepareParameters(parameters)
  console.log('preparedParameters', preparedParameters)

  return {
    from: assist(
      function(preparedParameters, prepareSource, source) {
        const preparedSource = prepareSource(source)
        console.log('preparedSource', preparedSource)

        const source4Reduce = preparedSource.type === 'array'
                        ? preparedSource.source
                        : [preparedSource.source]
        
        const output = source4Reduce.reduce(
          function(result, sourceItem) {
            result.push(
              preparedParameters.reduce(
                function(collection, parameter) {
                  if(typeof(parameter) === 'string') {
                    collection[parameter] = sourceItem[parameter]
                  }else if(Array.isArray(parameter)) {
                    const type = typeof(parameter[1])
                    let value = undefined
                    switch(type) {
                      case 'string':
                        collection[parameter[1]] = sourceItem[parameter[0]]
                      break
                      case 'function':
                        value = parameter[1](sourceItem[parameter[0]])
                        if(parameter.length === 3) {
                          collection[parameter[2]] = value
                        }else {
                          collection[parameter[0]] = value
                        }
                      break;
                    }
                  }
                  return collection
                },
                {}
              )
            )
            return result
          },
          []
        )
        return preparedSource.type === 'array' ? output : output[0]

      },
      undefined,
      preparedParameters,
      prepareSource,
    )
  }
  
}


exports.choose = assist(main, undefined, prepareParameters, assist, prepareSource)
exports.assist = assist

/* 
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
          'handlers 里未包含字段名或字段处理方法，意味着 source 无法被处理'
        ]

        if(!handlers) {
          console.error(errors[0])
          return false
        }

        if(typeof(handlers) !== 'object') {
          console.error(errors[1])
          return false
        }

        if(Object.keys(handlers).length === 0) {
          console.error(errors[2])
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
 */
