import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import * as path from 'path'

import authRoutes from './Routes/AuthRoutes.js'
import empRoutes from './Routes/EmpRoutes.js'
import generalRoutes from './Routes/generalRoutes.js'
import AdminRoutes from './Routes/AdminRoutes.js'

app.use(express.static("client/build"));
app.get('*',req,resp=>{
    resp.send(path.resolve(__dirname,'client','build','index.html'))
})

// ----------CONFIGS--------------
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())
app.disable('etag');



app.use('/auth',authRoutes)
app.use('/emp',empRoutes)
app.use('/',generalRoutes)
app.use('/admin',AdminRoutes)

// -------------MONGOOSE SETUP-----------
const PORT = parseInt(process.env.PORT) || 9001
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName :'gowork'
}).then(()=>{
    app.listen(PORT, ()=>{console.log(`Server is running at port ${PORT}`)})
}).catch((error)=>{
    console.log(`${error}`)
})
