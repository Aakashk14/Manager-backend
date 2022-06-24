const express = require('express')
const main = require("../database/main")
const main_agent=require("../database/agents/data")
const access_agent = require("../database/agents/access")
const act = require('./activities')
const router = express.Router()

const session_chk=(req,res,next)=>{
    if(!req.session.userid){
        res.redirect("/")
    }else{
        next()
    }
}
router.get("/home",session_chk,async(req,res,next)=>{
    if(req.session.level!=0){
    let data = await main.get_data(req.session.userid)
    
    let result = await act.fetch_act(req.session.userid);
    result=JSON.parse(result)
    res.render("home.ejs",{data:data,level:req.session.level,result:result})

    }else{
        next()
    }
})
router.get("/home",async(req,res)=>{

    
    
    req.session.boss= await access_agent.boss(req.session.userid)

    let data = await main_agent.all_data(req.session.boss,req.session.userid,"open")
    data.events=data.events!=0?data.events.length:0
    data.tasks=data.tasks!=0?data.tasks.length:0
    
    res.render("home.ejs",{data:data,level:req.session.level})

    }
)


router.get("/tasks/new",async(req,res)=>{
let data = await main.fetch_agents(req.session.userid)
    res.render("newtask.ejs",{data:data,level:req.session.level,token:req.session.token})
})

// router.get("/events/new",async(req,res)=>{
//         res.render("newevents.ejs",{level:req.session.level,token:req.session.token})
//     })
    
module.exports=router;