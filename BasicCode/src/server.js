import express from 'express'
import { createClient } from 'redis'
import 'dotenv/config'

const app = express()
app.use(express.json())

const redis = createClient({url: process.env.REDIS_URL})

redis.on('connect', () => { console.log('Connected to Redis') });
await redis.connect();

const CACHE_KEY = "My_key"

//setting value to cache on a key
app.post('/api/set', async (req, res) => {
    await redis.set(CACHE_KEY, req.body.message || "Welcome to redis");
    res.json({success: true});
})

//getting a cached value through key
app.get('/api/get', async (req,res) => {
    const message = await redis.get(CACHE_KEY);
    res.json({ Retrieved: message })
})

//deleting from cache
app.delete('/api/delete', async (req,res) => {
    await redis.del(CACHE_KEY)
    res.json({success: true})
})

//checking if cache exists in redis
app.get('/api/exists', async (req,res) => {
    const exists = await redis.exists(CACHE_KEY)
    res.json({ exists: Boolean(exists) })
})

app.listen(3000, ()=>{
    console.log('http://localhost:3000')
})
