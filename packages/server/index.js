// A simple function to sum a range of numbers. This can also be expressed as:
// (max * (max - 1) - min * (min - 1)) / 2
// But this is an easy way to show off the async features of the module.
function sum(min, max) {
  let sum = 0
  for (let ii = min; ii < max; ++ii) {
    sum += ii
  }
  return sum
}

// I chose this number because it's big but also small enough that we don't go past JS's integer
// limit.
let num = Math.pow(2, 30)

// First we execute a single thread run
let start1 = new Date()
let result = sum(0, num)
console.log('Calculated ' + result + ' in ' + (Date.now() - start1) + 'ms')

// Now we do the same thing over 8 threads
let start2 = new Date()
let ivm = require('isolated-vm')
let numThreads = 8
let promises = Array(numThreads)
  .fill()
  .map(async function(_, ii) {
    // Set up 4 isolates with the `sum` function from above
    let isolate = new ivm.Isolate()
    let context = await isolate.createContext()
    let script = await isolate.compileScript(sum + '')
    await script.run(context)
    let fnReference = await context.global.get('sum')

    // Run one slice of the sum loop
    let min = Math.floor((num / numThreads) * ii)
    let max = Math.floor((num / numThreads) * (ii + 1))
    return await fnReference.apply(undefined, [min, max])
  })
Promise.all(promises).then(function(sums) {
  let result = sums.reduce((a, b) => a + b, 0)
  console.log('Calculated ' + result + ' in ' + (Date.now() - start2) + 'ms')
})
// They get the same answer but the async version can do it much faster! Even
// with the overhead of building 4 isolates
// > Calculated 9007199187632128 in 1485ms
// > Calculated 9007199187632128 in 439ms
