//Promiss chaining
require('../src/db/mongoose')
const { update } = require('../src/models/user')
const User = require('../src/models/user')

User.findByIdAndUpdate('606ed8c2e7164e4f1cc3d9c8',{age:38}).then((user) => {
    console.log(user)
    return User.countDocuments({age:37})
}).then((res) => {
    console.log(res)
}).catch((e) => {
    console.log(e)
})


//Async Update
const updateAgeCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeCount('606ed8c2e7164e4f1cc3d9c8',37).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})

