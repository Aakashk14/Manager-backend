const db = require("../../database/config")
const fs = require('fs')
const { json } = require("express/lib/response")

function fetch_tasks_agent(boss,userid,st){
    return new Promise(resolve=>{
db.query("select * from tasks where userid=? and agentId=? and status=?",[boss,userid,st],(err,rows)=>{
    resolve(rows.length>0?rows:0)
})
    })
}

function fetch_events(boss,userid){
return new Promise(resolve=>{
db.query("select * from events where userid=? and eventsId in( select eventsId from e_members where userid=? and agentId=?)",[boss,boss,userid],(err,rows)=>{

 resolve(rows.length>0?rows:0)
})
    })

}

function all_data(boss,userid,st){
    return new Promise(async resolve=>{
    let data={}
   data.events= await fetch_events(boss,userid)
   data.tasks=await fetch_tasks_agent(boss,userid,st)
   resolve(data)
    })
}
//    fs.readFile(`./Storage/users/${boss}/events/${t}`,(err,data)=>{
//        if(err) resolve(0)
//        data = JSON.parse(data)
//        console.log(data,"jsonn")
//    })
// })
// }
function fetch_task(taskid,agentid,status){
    
    return new Promise(resolve=>{
        db.query("select * from tasks where taskId=? and agentId=? and status=?",[taskid,agentid,status],(err,rows)=>{
            if(err) console.log(err)
            resolve(rows.length>0?rows:0)

        })
    })
}
module.exports={
    fetch_tasks_agent:fetch_tasks_agent,
    fetch_events:fetch_events,
    fetch_task:fetch_task,
    all_data:all_data
}
