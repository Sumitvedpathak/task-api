const Task = require('../models/task')
const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/task', auth, async (req,res) => {
    try {
        console.log(req.body)
        const task = new Task({
            ...req.body,
            owner: req.user._id   
        })
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
    // console.log(req.body)
    // const task = new Task(req.body)
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

//GET /tasks?completed=true
//Pagination - GET /tasks?limit=10&page=0
//Sorting - GET /tasks?sortby=createdat:desc
router.get('/tasks', auth, async (req,res) => {
    try {
        const match = {}
        const sort = {} // sort object created for mongoose
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        if(req.query.page !== undefined && req.query.limit===undefined){
            req.query.limit=1
        }
        if(req.query.sortby){
            const parts = req.query.sortby.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        console.log(req.query.sortby)
        //const tasks = await Task.find({owner:req.user._id})// OR
        // await req.user.populate('myTasks').execPopulate() //to filter out task below code is modified
        await req.user.populate({
            path: 'myTasks',
            match,
            options: {
                limit: parseInt(req.query.limit),//how many records to return
                skip: parseInt(req.query.limit) * parseInt(req.query.page),//Skip - skips the number of records
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.myTasks)
    } catch(e) {
        res.status(400).send(e)
    }

    // Task.find({}).then((tasks) => {
    //     res.status(200).send(tasks)
    // }).catch((e) => {

    // })
})

router.get('/task/:id', auth, async (req,res) => {
    try {
        const _id = req.params.id
        console.log(_id)
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner:req.user._id})
        console.log(task)
        if(!task){
            return res.status(404).send('Task Not found')
        }
        res.status(200).send(task)
    } catch(e) {
        res.status(500).send('Inavlid User Id')
    }

    // const _id = req.params.id
    // // console.log(_id)
    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(404).send('User Not Found')
    //     }
    //     res.status(200).send(task)
    // }).catch((e) => {
    //     res.status(500).send('Inavlid User Id')
    // })
})

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedProps = ['completed','description']
    const invalidProps = updates.every((prop) => {
        return allowedProps.includes(prop)
    })
    //OR invalidProps = update.every((prop) => allowedProps.includes(prop))
    console.log(invalidProps)
    if(!invalidProps){
        return res.status(400).send('Ivalid Request')
    }

    try {
        // const task  = await Task.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators : true})
        const task = await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send('Task Not found')
        }
        res.send(task)
    } catch(e) {
        return res.status(500).send(e)
    }
})

module.exports = router