const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userId = new mongoose.Types.ObjectId
const testUser = {
    _id: userId,
    name:'SumitV',
    email:'test@test.com',
    password: 'test1234',
    tokens:[{
        token: jwt.sign({_id:userId},process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(testUser).save()
})

test('Signup a new User', async () => {
    await request(app).post('/user').send({
        name:'SumitV1',
        email:'test1@test.com',
        password: 'test1234'
    }).expect(201)
})

test('Login User', async () => {
    await request(app).post('/user/login').send(testUser).expect(200)
})

test('Login Failed', async () => {
    await request(app).post('/user/login').send({
        name:'SumitV2',
        email:'test2@test.com',
        password: 'test1234!'
    }).expect(400)
})

test('Get User Profile', async () => {
    await request(app).get('/user/me')
    .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
    .send().expect(200)
})

test('Delete User Success', async () => {
    await request(app).delete(`/user/me`)
    .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
    .send().expect(200)
})

test('Delete User failed', async () => {
    await request(app).delete(`/user/me`)
    .send().expect(401)
})