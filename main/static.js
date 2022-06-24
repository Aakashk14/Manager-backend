const express = require('express')
const router = express.Router()
const fs = require('fs')

const db = require("../database/data")
const db_agent = require("../database/agents/data")
const db_access = require("../database/agents/access")
router.get("/tasks",async(req,res,next)=>{

if(req.session.level==0){
    next()

}else{
task_status=req.query.status?req.query.status:"open"
let data = await db.fetch_tasks(req.session.userid,task_status)
if(req.query.api==1){
    res.send(data!=0?data:"empty")
}else{
res.render("tasks.ejs",{data:data,level:req.session.level})
}

}

})
router.get("/tasks",async(req,res)=>{
data = await db_agent.fetch_tasks_agent(req.session.boss,req.session.userid,"open")
if(req.query.api==1){
    res.send(data)
}else{
res.render("tasks.ejs",{data:data,level:req.session.level})
}

})

router.get("/task/:id",async(req,res,next)=>{
var file=0;
var image=0;
if(req.session.level==1){
let task_details = await db.task(req.session.userid,req.params.id)


    fs.readFile(`./Storage/users/${req.session.userid}/tasks/${req.params.id}/task${req.params.id}.txt`,'utf-8',(err,data)=>{
        if(err) console.log(err)
        console.log("got data",data)
        fs.readFile(`./Storage/users/${req.session.userid}/tasks/${req.params.id}/task${req.params.id}_comments.txt`,'utf-8',(err,comments)=>{
        
         if(err) comments=0
         comments=JSON.parse(comments)

        fs.readdir(`./Storage/users/${req.session.userid}/tasks/${req.params.id}/files/`,(err,files)=>{
          if(err){ }else{
          file=files[0]
          let ext = file.substring(file.lastIndexOf(".")+1,file.length)
          if(ext=="png" || ext=="jpg" || ext=="jpeg"){
              image=1;
          }
            }

        
        res.render("view_task.ejs",{data:data,task:task_details,comments:comments,level:req.session.level,file:file,image:image})
    })
})
})
}else{
    next()
}

})

router.get("/task/:id",async(req,res)=>{
let task_details = await db_agent.fetch_task(req.params.id,req.session.userid,"open")

fs.readFile(`./Storage/users/${req.session.boss}/tasks/${req.params.id}/task${req.params.id}.txt`,'utf-8',(err,data)=>{
    if(err) console.log(err)
  
    fs.readFile(`./Storage/users/${req.session.boss}/tasks/${req.params.id}/task${req.params.id}_comments.txt`,'utf-8',(err,comments)=>{
    
     if(err) comments=0
     comments=JSON.parse(comments)

    res.render("view_task.ejs",{data:data,task:task_details,comments:comments,level:req.session.level})
})
})

})
router.get("/pvt/files/task/:id/:name",(req,res)=>{
   
    res.sendFile(`./Storage/users/${req.session.userid}/tasks/${req.params.id}/files/${req.params.name}`,{root:"./"})
})

router.get("/events/new",(req,res)=>{

    res.sendFile("newevents.html",{root:"./views"})
})


router.get("/events",async(req,res,next)=>{
    if(req.session.level==0){
next()
    }else{
    let data= await db.fetch_events(req.session.userid)

    res.render("events.ejs",{data:data,level:req.session.level,token:req.session.token})
    }
})
router.get("/events",async(req,res)=>{
   let data=await db_agent.fetch_events(req.session.boss,req.session.userid)
   res.render("agents/events",{data:data,level:req.session.level})
})
router.get("/events/members",async(req,res)=>{
 
    if(req.session.level==0){

    
    var access = await db_access.e_access(user,req.session.userid,req.query.id)
    }
    if(access==1 || req.session.level==1){
       user= req.session.boss?req.session.boss:req.session.userid
    let data = await db.get_e_members(user,req.query.id)
    console.log("got data",data)
    res.send(data)
    }else{
        res.send("error")
    }
})
module.exports=router