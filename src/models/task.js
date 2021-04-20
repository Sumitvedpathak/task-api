const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task',{
    description:{
        type:String,
        require: true,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{//seetting up relationship with Task and User
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }

})



module.exports = Task