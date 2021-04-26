// const add = require("../src/testCase")

test('Hello', ()=>{
    const sum = 12+4
    expect(sum).toBe(16)
})

// //For async functions, jest doesnt know if below function is async so its pasess. 
// // In order let it know, add a callback fucntion "done" like below.
// test('Test Async funct', (done)=>{
//     setTimeout(()=>{
//         expect(1).toBe(1)
//         done()
//     },2000)
// })

// test('Test Promiss add function', (done) => {
//     add(2,3).then((sum) => {
//         expect(sum).toBe(5)
//         done()
//     })
// })

// test('Test async/await add function', async () => {
//     const sum = await add(2,3)
//     expect(sum).toBe(5)
// })