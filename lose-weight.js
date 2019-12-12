'use strict'

function assist(fn, thisArg, ...restParameters) {
  return fn ? fn.bind(
                thisArg,
                ...restParameters
              )
            : function() {}
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
      const StringAndNumber = ['string', 'number']
      let parameter = item
      const type = Array.isArray(parameter) ? 'array' : typeof(parameter)
      if(type === 'number') {
        parameter = parameter.toString()
      }
      if(
        ['string', 'array', 'number'].indexOf(type) === -1 
        || parameter.length === 0
      ) {
        throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型必须为 String 或 Array 或 Number！如果其类型为 String 或 Array 那么其长度必须大于 0！`)
      }else if(type === 'array') {
        if(parameter.length < 2 || parameter.length > 3) {
          throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的长度必须大于 1，且小于 4！`)
        }else {
          let parameter_0 = parameter[0]
          const typeOfParameter_0 = typeof(parameter_0)
          if(typeOfParameter_0 === 'number') {
            parameter_0 = parameter_0.toString()
            parameter[0] = parameter_0
          }
          if(
            StringAndNumber.indexOf(typeOfParameter_0) === -1 
            || parameter_0.length === 0
          ) {
            throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 1 项类型必须为 String 或 Number, 如果其类型为 String 那么其长度必须大于 0！`)
          }
          let parameter_1 = parameter[1]
          const typeOfParameter_1 = typeof(parameter_1)
          if(typeOfParameter_1 === 'number') {
            parameter_1 = parameter_1.toString()
            parameter[1] = parameter_1
          }

          const typeOfParameter_1_isStringOrNumber = StringAndNumber.indexOf(typeOfParameter_1) !== -1

          if(
            ['string', 'function', 'number'].indexOf(typeOfParameter_1) === -1
            || (typeOfParameter_1_isStringOrNumber && parameter_1.length === 0)
          ) {
            throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 2 项类型必须为 String 或 Function 或 Number , 如果其类型为 String 那么其长度必须大于 0！`)
          }

          let parameter_2 = parameter[2]
          const typeOfParameter_2 = typeof(parameter_2)
          if(typeOfParameter_2 === 'number') {
            parameter_2 = parameter_2.toString()
            parameter[2] = parameter_2
          }

          if(parameter.length === 3) {
            if(typeOfParameter_1_isStringOrNumber) {
              throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 2 项类型已经为 String 或 Number, 因此第 3 项禁止存在！`)
            }else if(
              StringAndNumber.indexOf(typeOfParameter_2) === -1
              || parameter_2.length === 0
            ) {
              throwError(`[ERROR] 函数 choose 的第 ${index + 1} 个参数类型为 Array！该数组的第 3 项类型必须为 String 或 Number, 如果其类型为 String 那么其长度必须大于 0！`)
            }
          }
        }
      }
      return parameter
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
        console.log(preparedParameters)
        
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

