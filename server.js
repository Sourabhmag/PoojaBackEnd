const express=require("express");
const app=express()
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const routeUrls=require('./routes/routes')
const cors=require("cors")
dotenv.config()
mongoose
.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connection Successfully with Mongoose"))
.catch((e) => console.log(e));

app.use(express.json())
app.use(cors())
app.use('/app',routeUrls)
app.listen(4000,()=>console.log("server is up and running"))
