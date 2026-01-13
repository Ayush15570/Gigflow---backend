import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import authRoute from "./routes/auth.routes.js"
app.use("/api/auth",authRoute)

import gigRoute from "./routes/gig.routes.js"
app.use("/api/gigs",gigRoute)

import bidRoute from "./routes/bid.routes.js"
app.use("/api/bids",bidRoute)

export {app}