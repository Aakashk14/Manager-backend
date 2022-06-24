
const db = require("../database/config")
const {signup} = require("../database/users")
const {generate_rand}=require("../main/fn")
const activities = require("../main/activities")


// data = await settings.new_agent(req.session.userid,req.body.email)

async function new_agent(userid,email){
 password = await generate_rand()
return new Promise(resolve=>{

signup(email,password,0,0,1).then((agentid)=>{

if(agentid!=-1){


activities.post_act(userid,"new agent",1,email)
    db.query("insert into relations(userid,relId) values(?,?)",[userid,agentid],(err,rows)=>{
        if(err) console.log(err)
    })
    
    resolve(password)
}else{
    resolve(0)
}
})
})
}

function fetch_agents(userid){
    return new Promise(resolve=>{
    db.query("select email,password,firstlogin,userid from login where userid in(select relId from relations where userid=?)",[userid],(err,rows)=>{
        if(err) console.log(err)
        resolve(rows.length>0?rows:0)
        
    })
})
}
function agent_detail(userid,agentId){
    return new Promise(resolve=>{
        db.query("select * from relations where userid =? and relId in(select userid from login where email=?)",[userid,agentId],(err,rows)=>{
            resolve(rows.length>0?rows:0)
        })
    })
}
function del_agent(userid,email){
    return new Promise(resolve=>{
    db.query("delete from login where email=? ",[email],(err,rows)=>{
        if(err) console.log("login error",err)
        activities.post_act(userid,"agent delete",1,email)
        resolve(rows.length>0?rows:0)
        
    })
})
}
function profile(userid){
    return new Promise(resolve=>{
db.query("select * from login where userid=?",[userid],(err,rows)=>{
    resolve(rows)
})
})
}



module.exports={
    new_agent:new_agent,
    fetch_agents:fetch_agents,
    agent_detail:agent_detail,
    del_agent:del_agent,
    profile:profile
    
}
