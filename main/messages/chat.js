const express = require('express')

const router = express()
const db=require("../../database/main")
const db_chat = require("../../database/chat")

router.get("/chat",async(req,res)=>{
    if(req.session.level==1){
   var data = await db.fetch_agents(req.session.userid)
   var active= await db_chat.active_u(req.session.userid)
   res.render("chats.ejs",{level:req.session.level,data:data,active:active})


    }else{
        var data=0;
        var active= await db_chat.boss_info(req.session.boss)
        res.render("agents/chats",{level:req.session.level,data:data,active:active})

    }
})

//    $.get(`/api/chat/fetch?to=${$(this).attr('id')}`,function(response){

router.get("/api/chat/fetch",async(req,res)=>{
    var chats = await db_chat.fetch_chat(req.session.userid,req.query.to)
    res.send(chats)
})
///api/chat/send?msg=${msg}&to=${$(this).attr('id')}
//function insert_chat_a(userid,to_id,msg,turn){

router.get("/api/chat/send",(req,res)=>{
db_chat.insert_chat_a(req.session.userid,req.query.to,req.query.msg,true)
db_chat.insert_chat_a(req.query.to,req.session.userid,req.query.msg,false)
res.sendStatus(200)
})
module.exports=router;