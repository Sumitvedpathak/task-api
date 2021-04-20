const mongoose = require('mongoose')
const validator = require('validator')
const bcrupt = require('bcryptjs')
const jwt = require('jsonwebtoken') 
const Task = require('/task')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email not valid')
            }
        }
    },
    password:{
        type:String,
        require:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                console.log('Password should not contain same name')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Value cannot be -ve')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{//This adds timestamps in the response
    timestamps: true
})

userSchema.virtual('myTasks', {
    ref: 'Task',
    localField:'_id',
    foreignField:'owner'
})


//TO hide some private data from users.
userSchema.methods.getPublicProfile = async function() {
    const user = this
    const publicUserProfile = user.toObject()
    delete publicUserProfile.password
    delete publicUserProfile.tokens
    return publicUserProfile
}

//Another way to handle directly to hide some data is Override toJSON method
userSchema.methods.toJSON = function() {
    const user = this
    const publicUserProfile = user.toObject()
    delete publicUserProfile.password
    delete publicUserProfile.tokens
    return publicUserProfile
}


userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'usethisstring')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('No User found with email ' + email)
    }
    const isMatch = await bcrupt.compare(password,user.password)
    if(!isMatch) {
        throw new Error('Invalid Credentials ')
    }
    return user
}

//Hashes password before saving
userSchema.pre('save', async function (next) { //Not arrow function as this does not gets bind to arrow function
    const user = this
    if(user.isModified('password')){
        user.password = await bcrupt.hash(user.password,8)
    }
    next()
})

//Delete Tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User