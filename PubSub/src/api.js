import express from 'express'
import { createClient } from 'redis'
import 'dotenv/config'

const app = express();
app.use(express.json())

const publisher = createClient({url: process.env.REDIS_URL})
await publisher.connect(); 

app.post('/notifications' , async (req,res) => {
    const payload = {
        title: req.body.title,
        createdAt: new Date().toISOString()
    }

    const reciever = await publisher.publish('notifications', JSON.stringify(payload))
    res.json({message: `Notification sent by ${reciever}`})
})

app.listen(3000, () => {
    console.log('http://localhost:3000');
})