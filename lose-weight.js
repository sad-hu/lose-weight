'use strict'

function assist(fn, thisArg, ...restParameters) {
  return fn.bind(
    thisArg,
    ...restParameters
  )
}

function throwError(message) {
  throw new Error(message)
}

const prepareParameters = assist(
  function(throwError, parameters) {
    if(parameters.length === 0) {
      throwError('[ERROR] 函数 choose 的参数长度必须大于 0！')
    }

    return parameters.map(function(item, index) {
      const type = Array.isArray(item) ? 'array' : typeof(item)
      if(['string', 'array'].indexOf(type) === -1 || item.length === 0) {
        throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型必须为 String 或 Array！且其长度必须大于 0！`)
      }else if(type === 'array') {
        if(item.length < 2 || item.length > 3) {
          throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的长度必须大于 1，且小于 4！`)
        }else {
          if(typeof(item[0]) !== 'string' || item[0].length === 0) {
            throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 1 项类型必须为 String, 其长度必须大于 0！`)
          }
          const typeOfItem1 = typeof(item[1])
          if(
            ['string', 'function'].indexOf(typeOfItem1) === -1
            || (typeOfItem1 === 'string' && item[1].length === 0)
          ) {
            throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 2 项类型必须为 String 或 Function, 如果其类型为 String 那么其长度必须大于 0！`)
          }

          if(item.length === 3) {
            if(typeOfItem1 === 'string') {
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

  },
  undefined,
  throwError
)

const prepareSource = assist(
  function(throwError, source) {
    const type = Array.isArray(source) ? 'array' : typeof(source)
    if(['array', 'object'].indexOf(type) === -1) {
      throwError('[ERROR] 函数 from 的参数类型必须是 Array 或 Object！')
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

  const preparedParameters = prepareParameters(parameters)

  return {
    from: assist(
      function(preparedParameters, prepareSource, source) {
        const preparedSource = prepareSource(source)
        
        const output = (
          preparedSource.type === 'array'
            ? preparedSource.source
            : [preparedSource.source]
        )
        .reduce(
          function(result, sourceItem) {
            result.push(
              preparedParameters.reduce(
                function(collection, parameter) {
                  if(typeof(parameter) === 'string') {
                    collection[parameter] = sourceItem[parameter]
                  }else if(Array.isArray(parameter)) {
                    switch(typeof(parameter[1])) {
                      case 'string':
                        collection[parameter[1]] = sourceItem[parameter[0]]
                      break
                      case 'function':
                        if(parameter.length === 3) {
                          collection[parameter[2]] = parameter[1](sourceItem[parameter[0]])
                        }else {
                          collection[parameter[0]] = parameter[1](sourceItem[parameter[0]])
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

