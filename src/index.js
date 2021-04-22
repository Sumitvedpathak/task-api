const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())//customize server to access directly an json object
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server running on '+ port)
})

// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
//     const token = jwt.sign({_id:'test123'},'teststring',{expiresIn:'5 minutes'})
//     console.log(token)
//     console.log(jwt.verify(token,'teststring'))
// }

// // myFunction()

// const Task = require('./models/task')
// const User = require('./models/user')
// const multer = require ('multer')

// const main = async () => {
//     //Get Owner for a task.
//     // const task = await Task.findById('607cb9aec2920010081cf01a')
//     // await task.populate('owner').execPopulate() // populates the whole owner object in owner
//     // console.log(task.owner.name)

//     // const user = await User.findById('607cb934c2920010081cf017')
//     // await user.populate('mytasks').execPopulate()
//     // console.log(user.mytasks)


// }

// main()