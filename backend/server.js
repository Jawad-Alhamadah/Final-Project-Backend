import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'

import router from "./router/router.js"
import cors from "cors"


dotenv.config()

startConnection().catch(err => console.log(err))
async function startConnection() {
    await mongoose.connect(process.env.CONNECTION_STRING)

    console.log("connected to Mongoose")
}

let port = process.env.BACKEND_PORT 
const app = express()
app.use(express.json())

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], // Include PATCH here
  }));

app.use(router)


app.listen(port || 7000, () => console.log(`listening to ${port || 7000}`))



