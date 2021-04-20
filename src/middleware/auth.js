const jwt = require('jsonwebtoken')
const User = require('../models/user')

//Anything that needs to do before routing, can be added here. Good place to add code like site application
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const data = jwt.verify(token,'usethisstring')
        const user = await User.findOne({_id:data._id, 'tokens.token':token})
        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()

    } catch(e) {
        res.status(401).send(e)
    }
}

module.exports = auth