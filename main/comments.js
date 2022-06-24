const express = require('express')
const router = express.Router()
const db = require("../database/data")
const {message_json} = require("./fn")
const { nextTick } = require('process')

//user,x,filename,comment
router.post("/task/comment/add",async(req,res)=>{
let access = await db.task(req.session.userid,req.body.taskid)
if(access!=0 && access[0].status=="open")
    filename="task"+req.body.taskid+"_comments.txt"
    //function message_json(user,x,filename,comment,Name){

    message_json(req.session.userid,"tasks",req.body.taskid,filename,req.body.comment,req.session.name)
    res.send(req.session.Name)
  


})



module.exports=router;