const db = require("../database/config")
const fs = require('fs')

function fetch_tasks(user,status){
    return new Promise(resolve=>{
        db.query("select * from tasks where userid=? and status=?",[user,status],(err,rows)=>{
            if(err) console.log(err)
            resolve(rows.length>0?rows:0)

        })
    })
}
function fetch_events(user){
    return new Promise(resolve=>{
        db.query("select * from events where userid=?",[user],(err,rows)=>{
            if(err) console.log(err)
            resolve(rows.length>0?rows:0)

        })
    })
}

function task(user,taskid){
    return new Promise(resolve=>{
        db.query("select * from tasks where userid=? and taskId=?",[user,taskid],(err,rows)=>{
            resolve(rows.length>0?rows:0)
        })
    })
}

function update_task(status,user,taskId){
    return new Promise(resolve=>{
        db.query("update tasks set status=? where taskId=? and userid=?",[status,taskId,user],(err,rows)=>{
            if(err) resolve(0)
            resolve(1)

        })
    })
}
function get_e_members(user,eventid){
    var result={}
    return new Promise(resolve=>{
        db.query("select email from login where userid in (select agentId from e_members where userid=? and eventsId=?)",[user,eventid],(err,rows)=>{
            fs.readFile(`./Storage/users/${user}/events/${eventid}/event${eventid}_members.json`,'utf-8',(err,data)=>{
                if(err){ console.log(err) }
                else{
                    result.external=data;
                    console.log("else part",result)

                }
            
            
            rows.length>0?result.users=rows:0
            resolve(result)
            })
        })
    })
}
function e_delete(user,eventid){
    return new Promise(resolve=>{
        db.query("delete from events where userid=? and eventsId=?",[user,eventid],(err,rows)=>{
            if(err) resolve(0)
            resolve(1)
        })
    })
}
function task_del(userid,taskid){
    return new Promise(resolve=>{
        db.query("delete from tasks where userid=? and taskId=?",[userid,taskid],(err)=>
        {
            resolve()
        })
    })
}
module.exports={
    fetch_tasks:fetch_tasks,
    task:task,
    fetch_events:fetch_events,
    update_task:update_task,
    get_e_members:get_e_members,
    e_delete:e_delete,
    task_del:task_del
}