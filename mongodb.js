const {MongoClient, ObjectID} = require('mongodb')

const conURL = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager'

MongoClient.connect(conURL, { useNewUrlParser : true, useUnifiedTopology:true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to DB')
    }

    console.log('Connection successfully!')
    const db = client.db(dbName)

    // db.collection('task').insertMany([{
    //     description:'Test1',
    //     completed:false
    // },{
    //     description:'Test2',
    //     completed:false
    // },{
    //     description:'Test3',
    //     completed:false
    // }], (error, result) => {
    //     if(error){
    //         return console.log('Unable to create Tasks')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').findOne({name:'Sumit'},(error, user) => {
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(user)
    // })

    // db.collection('users').find({age:37}).toArray((error,users) => {
    //     console.log(users)
    // })

    // const updateRes = db.collection('users').updateOne({
    //     _id:new ObjectID('606c495d689a8f3bb0dd53d4')
    //     },{
    //         //$set:{name:'SumitV'}
    //         $inc:{age:1}
    // })

    // const updateRes = db.collection('task').updateMany({
    //     completed:false
    //     },{
    //         $set:{completed:true}
    // })

    // updateRes.then((res)=>{
    //     console.log(res)
    // })

    db.collection('task').deleteMany({description:'Test3'}).then((result)=>{
        console.log(result)
    }).catch((error)=>{console.log(error)})
})
