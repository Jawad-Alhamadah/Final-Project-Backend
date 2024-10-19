import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import router from "./router/router.js"
import cors from "cors"
let port = 3000 

dotenv.config()

startConnection().catch(err => console.log(err))
async function startConnection() {
    await mongoose.connect(process.env.CONNECTION_STRING)

    console.log("connected to Mongoose")
}

const app = express()
app.use(express.json())
app.use(cors())
app.use(router)


app.listen(port || 7000, () => console.log(`listening to ${port || 7000}`))



