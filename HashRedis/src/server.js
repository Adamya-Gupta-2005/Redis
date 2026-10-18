import express from 'express'
import { createClient } from 'redis'
import 'dotenv/config'

const app = express()
app.use(express.json())

const redis = createClient({url: process.env.REDIS_URL})
redis.on('connect', () => { console.log('Connected to Redis') });

await redis.connect();

app.post('/user/:id/json', async (req,res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body))
    res.json({savedAs: 'JSON'})
})

app.get('/user/:id/json', async (req,res) => {
    const raw = await redis.get(`user:${req.params.id}:json`)
    res.json({ user: raw ? JSON.parse(raw) : null })
})

app.post('/user/:id/hash', async (req,res) => {
    await redis.hSet(`user:${req.params.id}:hash`, req.body)
    res.json({savedAs: 'HASH'})
})

app.get('/user/:id/hash', async (req,res) => {
    const user = await redis.hGetAll(`user:${req.params.id}:hash`)
    res.json({user})
})

app.listen(3000, () => {
    console.log('http://localhost:3000')
})