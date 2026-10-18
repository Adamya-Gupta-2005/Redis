import express from 'express'
import { createClient } from 'redis'
import 'dotenv/config'

const app = express()
app.use(express.json())

const redis = createClient({url: process.env.REDIS_URL})
redis.on('connect', () => {console.log('Connectd to redis')})

await redis.connect();

const QUEUE_KEY = 'queue:email'

app.post('/emails', async (req,res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject,
        body: req.body.body
    }

    await redis.lPush(QUEUE_KEY, JSON.stringify(job))
    res.json({queued: true, job})
})

app.get('/emails/process-one', async(req,res) => {
    const rawJob = await redis.rPop(QUEUE_KEY)
    
    const job = JSON.parse(rawJob)
    res.json({processed: true, job})
})

app.listen(3000, () => {
    console.log('http://localhost:3000')
})