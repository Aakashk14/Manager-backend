const db = require("../../database/config")
function boss(userid){
    return new Promise(resolve=>{
db.query("select userid from relations where relId=?",[userid],(err,rows)=>{
    resolve(rows.length>0?rows[0].userid:0)
})
    })
}
function task_a(boss,taskid,agentid){
    return new Promise(resolve=>{
        db.query("select * from tasks where userid=? and taskId=? and agentId=?",[boss,taskid,agentid],(err,rows)=>{
            rows.length>0?resolve(1):resolve(0)
        })
    })
}
function e_access(boss,eventid,agentid){
    return new Promise(resolve=>{
        db.query("select * from e_members where userid=? and eventsId=? and agentId=?",[boss,eventid,agentid],(err,rows)=>{
            resolve(rows.length>0?1:0)
        })
    })
}


module.exports={
    boss:boss,
    task_a:task_a,
    e_access:e_access
}