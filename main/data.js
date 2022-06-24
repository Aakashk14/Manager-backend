const express = require('express')
const fs = require('fs')
const multer = require('multer')
const db_main = require("../database/main")
const db_data = require("../database/data")
const access = require("../database/agents/access")
const activities=require("../main/activities")
const {token_chk} = require("./fn")

const router = express.Router()
const storage=multer.diskStorage({
    destination:async function(req,file,cb){
        agent = req.body.agent=="me"?req.session.userid:req.body.agent
       let result= await db_main.new_task(req.session.userid,agent,req.body.name,req.body.details,"open")
        
        let dr= `./Storage/users/${req.session.userid}/tasks/${result}/files/`
        fs.mkdir(dr,(err)=>{
            if(err){console.log(err)}
        })
        cb(null,dr)
    
},filename:function(req,file,cb){
    
    cb(null,file.originalname)
}
})
const upload = multer({storage:storage})



router.post("/task/create",upload.single("file"),async(req,res,next)=>{
    if(!req.file){
        next()

    }else{
        res.redirect("/tasks")
    }
})
router.post("/task/create",token_chk,async(req,res)=>{
    agent = req.body.agent=="me"?req.session.userid:req.body.agent
    await db_main.new_task(req.session.userid,agent,req.body.name,req.body.details,"open").then(()=>{
        res.redirect("/tasks")
    })
})
router.post("/tasks/delete",async(req,res)=>{
    if(req.session.level==0){
        res.send("error")
    }else{
    for(x of req.body.tasks){
        x=parseInt(x)
        await db_data.task_del(req.session.userid,x)



    }
    res.send("done")
}
})
router.post("/events/create",token_chk,async(req,res)=>{
    

    // agent = req.body.agent=="me"?req.session.userid:req.body.agent
//function events_members(user,emails,eventId){

     let response = await db_main.new_event(req.session.userid,req.body.name,req.body.details,req.body.start_date)
  
   db_main.events_members(req.session.userid,req.body.emails,response)
   res.redirect("/events")
       



})
 //function update_task(status,user,taskId){
    router.post("/task/completed",async(req,res,next)=>{

   if(req.session.level==0){
       next()
   }else{

        await db_data.update_task("completed",req.session.userid,req.body.task).then((result)=>{

            result==1?res.send("done"):res.send("error")
        })

}
    })
router.post("/task/completed",async(req,res)=>{

   
    let t = await access.task_a(req.session.boss,req.body.task,req.session.userid)
    
    if(t==1){
    await db_data.update_task("completed",req.session.boss,req.body.task).then((result)=>{
        activities.post_act(req.session.boss,"task",0,req.session.email)

        result==1?res.send("done"):res.send("error")
    })
}else{
    res.send("error")
}
})
router.post("/event/delete",async(req,res)=>{
    let result = await db_data.e_delete(req.session.userid,req.body.id)
    res.send(result!=0?"ok":"error")

})

module.exports=router;