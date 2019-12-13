const {choose, assist} = require('../lose-weight')

function test(cb, ...rest) {
  try {
    return cb(...rest)
  }catch(e) {
    console.log(e.message)
  }
}

const source = [
  {
    [undefined]: 'un de fined'
  },
  {
    a: 'a'
  },
  {
    b: 'b'
  },
  {
    1: 'one'
  }
]
const source2 = {b: 'bb'}

const rt = choose(
    'undefined', 
    [
      'a', 
      assist(
        function(awsl, value) {return value && value + `-made. ${this.omg}, the ${awsl}!`},
        {omg: 'This is the this!'},
        'AWSL'
      ),
      'null',
    ],
    '1'
  )
  .from(source)

const rt2 = choose(
    'undefined', 
    ['a', function(awsl, value) {return value && value + `-made, ${awsl}!`}.bind(undefined, 'AWSL'), 'null']
  )
  .from(source2)

const rt3 = choose('undefined', 'yoyo').from([])

const rt4 = choose('undefined', 'yoyo').from({})

const rt5 = choose('yellow', 'boots').from([{}, {}])


console.log('rt', rt)
console.log('rt2', rt2)
console.log('rt3', rt3)
console.log('rt4', rt4)
console.log('rt5', rt5)

console.log('\n=== test ===\n')

test(choose)
test(choose, undefined)
test(choose, [])
test(choose, '')
test(choose, 'ab')
test(choose, ['a'])
test(choose, ['a', 'b', 'c', 'd'])
test(choose, [null, 'b'])
test(choose, ['a', ''])
test(choose, ['a', []])
test(choose, ['a', ''])
test(choose, ['a', 'b', 'c'])
test(choose, ['a', function() {}, null])
test(choose, ['a', function() {}, ''])
test(choose, ['a', function() {}, 3])

const rt6 = choose(1, [3, 2]).from([0, 1, 2, 3, 4])
console.log(rt6)

const rt7 = choose(1, [3, function(value) { return value + '[3]'}, 2]).from([0, 1, 2, 3, 4])
console.log(rt7)

const source8 = [
  {
    a: 'a',
    b: true,
    c: null,
    d(p) {
      console.log('p and this:::', p, this)
    }
  },
  {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
  }
]

const result8 = choose(
  'b', 
  [
    'd', 
    function(value) {
      return value ? value.bind({it: 'it'}, 'p0')
                   : function() {}
    }, 
    'dd'
  ], 
  3, 
  5
).from(source8)

console.log('result8', result8)

result8[0].dd()
