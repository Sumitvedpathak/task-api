const User = require('../models/user')
const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()

router.post('/user/login',async (req,res) => {
    try {
        //Custome method
        const user = await User.findByCredentials(req.body.email, req.body.password) 
        const token = await user.generateAuthToken()
        console.log({user:user.getPublicProfile()})
        res.send({user,token})
        // res.send({user:await user.getPublicProfile(),token}) // Manual way to hide some data to send it back.
    } catch(e) {
        res.status(400).send(e.message)
    }
})

router.post('/user/logout', auth, async (req,res) => {
    try{
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })
        await req.user.save()
        res.send('User Logged out successfully!')
    }catch (e) {
        res.status(500).send(e)
    }
})

router.post('/user/logout/all', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('All User Sessions Logged out successfully!')
    }catch (e) {
        res.status(500).send(e)
    }
})

router.post('/user', async (req,res) => {
    try{
        console.log(req.body)
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user,token})
    } catch(e) {
        res.status(400).send(e)
    }
})

//2nd parameter auth, is nothing but it calls middlewhere, before any request is executed. Auth is nothing but a middlewere function
//this route will only return the user profile
router.get('/user/me', auth, async (req,res) => {
    try {
        res.status(200).send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
    //Below code is without async/await
    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((e) => {

    // })
})

router.get('/users', async (req,res) => {
    try {
        const user = await User.find({})
        res.status(200).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
    //Below code is without async/await
    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((e) => {

    // })
})

router.patch('/user/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedProps = ['name','email','password','age']
    const invalidProps = updates.every((prop) => {
        return allowedProps.includes(prop)
    })
    //OR invalidProps = update.every((prop) => allowedProps.includes(prop))
    console.log(invalidProps)
    if(!invalidProps){
        return res.status(400).send('Ivalid Request')
    }

    try {
        console.log(req.body)

        // this is commented because this method updates directly to DB, so need to iterate and updated individual params
        // const user  = await User.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true}) 

        //Instead use below 3 lines of code
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// router.patch('/user/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedProps = ['name','email','password','age']
//     const invalidProps = updates.every((prop) => {
//         return allowedProps.includes(prop)
//     })
//     //OR invalidProps = update.every((prop) => allowedProps.includes(prop))
//     console.log(invalidProps)
//     if(!invalidProps){
//         return res.status(400).send('Ivalid Request')
//     }

//     try {
//         console.log(req.body)

//         // this is commented because this method updates directly to DB, so need to iterate and updated individual params
//         // const user  = await User.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true}) 

//         //Instead use below 3 lines of code
//         const user = await User.findById(req.params.id)
//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()

//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

router.delete('/user/me',auth , async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    } catch(e) {
        return res.status(500).send(e)
    }
})

// router.delete('/user/:id', async (req, res) => {
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         console.log(user)
//         if(!user){
//             return res.status(404).send('User Not found')
//         }
//         res.send(user)
//     } catch(e) {
//         return res.status(500).send(e)
//     }
// })

module.exports = router