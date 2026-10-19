import { createClient } from 'redis'
import 'dotenv/config'

const subscriber = createClient({url: process.env.REDIS_URL})
await subscriber.connect();

await subscriber.subscribe("notifications", (message) => {

    const parsedMessage = JSON.parse(message);
    console.log("Received on notifications channel:", parsedMessage);
     
})

