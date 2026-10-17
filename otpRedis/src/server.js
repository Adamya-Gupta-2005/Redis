import express from 'express'
import { createClient } from 'redis'
import 'dotenv/config'

const app = express();
app.use(express.json());

const redis = createClient({ url: process.env.REDIS_URL })
redis.on('connect', () => { console.log('Connected to Redis') });

await redis.connect();

function otpKey(phone) {
    return `otp:${phone}`
}

app.post('/otp', async (req,res) => {
    const {phone} = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(otpKey(phone), otp, {EX:60});

    res.json({ message: 'OTP Sent', otp })
})

app.post('/otp/verify', async (req,res) => {
    const {phone, otp} = req.body
    const savedOtp = await redis.get(otpKey(phone))

    if(savedOtp != otp) return res.json({ message: 'OTP Invalid' })
    
    await redis.del(otpKey(phone))
    res.json({ message: 'OTP Success' })
})

app.get('/otp/:phone/ttl', async (req,res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone))

    return res.json({TTL: ttl})
})


app.listen(3000, () => {
    console.log('https://localhost:3000');
})
