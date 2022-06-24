const express = require('express')
const app = express()
const session = require('express-session')

const {Server} = require('socket.io')
const {createServer} = require('http')
const httpclient  = createServer(app)
const  io = new Server(httpclient,{})




app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("public"))
app.set("view engine","ejs")
const login = require("./database/users")
const db = require("./database/config")
global.x_session=session({
    resave:false,
    saveUninitialized:false,
    secret:"abcdef"
})
app.use(x_session)
db.connect((err)=>{
    if(err) console.log("error",err)
})

require("./sockets/socket_config")(io)

app.use(require("./main/user"))
app.use(require("./main/home"))
app.use(require("./main/data"))
app.use(require("./main/settings"))
app.use(require("./main/static"))
app.use(require("./main/comments"))
app.use(require("./main/messages/chat"))
app.use("/fullcalendar",express.static("lib"))


const host = "0.0.0.0"
httpclient.listen(3000,host)