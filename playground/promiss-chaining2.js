require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndRemove('606ee2ca0e36f463e4f97f9c').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed:false})
// }).then((res) => {
//     console.log(res)
// }).catch((e) => {
//     console.log(e)
// })


const deleteTaskCount = async (id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskCount('606ee74b54562d6a50625580').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})

