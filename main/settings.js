const multer = require('multer')
const express = require('express')
const router = express.Router()
const settings = require("../database/settings")
const db_user = require("../database/users")
const db = require("../database/users")
const {token_chk} = require("./fn")
const fs = require('fs')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        dr=`./Storage/users/${req.session.userid}`
        cb(null,dr)

    },
    filename:function(req,file,cb){
        a=file.originalname.split(".");
        a=a[a.length-1]
        temp="profile."+a
        cb(null,temp)
    }
})
const upload=multer({storage:storage}).single("file")
router.get("/settings",async(req,res,next)=>{
    if(req.session.level==0){
next()
    }
    let agents = await settings.fetch_agents(req.session.userid)
    res.render("settings.ejs",{agents:agents,token:req.session.token})
})
router.get("/settings",(req,res)=>{
    res.redirect("/my/profile")
})

router.get("/settings/fetch/agents",async(req,res)=>{
    let agents = await settings.fetch_agents(req.session.userid)

res.send(agents!=0?agents:"empty")
})
router.post("/agent/new",async(req,res)=>{
 data = await settings.new_agent(req.session.userid,req.body.email)
 
 res.send(data!=0?data:"error")

})
router.post("/settings/agent/delete",async(req,res)=>{
     access= settings.agent_detail(req.session.userid,req.body.agentId)

     if(access!=0){
     data = await settings.del_agent(req.session.userid,req.body.agentId)
     res.sendStatus(200)
     }else{
         res.send("error")
     }
    
    })
    
router.get("/my/profile",async(req,res)=>{
    let result =  await settings.profile(req.session.userid)
    res.render("profile.ejs",{level:req.session.level,result:result})
})
router.get("/profile/image/:name",(req,res)=>{
   
 res.sendFile(req.session.dp,{root:"./"})
 })

 router.post("/profile/dp",(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.send("ERROR")
        }else{
           console.log("file name",req.file)
            res.send("DONE")
        }
    })
})
router.post("/profile/update",async(req,res)=>{
await db_user.update_profile(req.body.name,req.body.password,req.body.email,req.session.userid,0)
res.redirect("/my/profile")
})

router.post("/account/delete",token_chk,async(req,res)=>{
    
  await db_user.removing_dir(req.session.userid)
  let data= await db_user.delete_account(req.session.userid)
   if(data==1){
       res.send("success")
   }else{
       res.send("error")
   }
})
module.exports=router;