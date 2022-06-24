const db = require("./config")
const fs = require('fs')
const {new_taskId,new_eventId,generate_rand,members} = require("../main/fn")
const activities=require("../main/activities")
const { task } = require("./data")

function get_data(user){
    console.log(user)

    return new Promise(resolve=>{
        let data=[];
        db.query("select count(taskId) from tasks where userid=? union all select count(eventsId) from events where userid=?",[user,user],(err,rows)=>{
            data.tasks=rows[0]['count(taskId)']

            data.events=rows[1]['count(taskId)']

            console.log(data)


        
            resolve(data)
        

    })
      
        
    })
}

function new_task(user,agent,name,details,status){
    return new Promise(resolve=>{
        return new_taskId(user).then((taskId)=>{
            let filename = "task"+taskId+".txt";
            fs.mkdir(`./Storage/users/${user}/tasks/${taskId}/`,{recursive:true},(err)=>{
                
                if(err){ console.log(err)}
                else{
            
            fs.writeFile(`./Storage/users/${user}/tasks/${taskId}/${filename}`,details,(err)=>{
                if(err) console.log(err)

            })
        }
    })
    
        
        db.query("insert into tasks(userid,taskId,Name,agentId,status) values(?,?,?,?,?)",[user,taskId,name,agent,status],(err,rows)=>{
            if(err) console.log(err)
            activities.post_act(user,"task new",1,0)
            resolve(taskId)
        })
    })
})
}

//     let response = await db_main.new_event(req.session.userid,req.body.name,req.body.details,req.body.start_date)

function new_event(user,name,details,start_date){
    return new Promise(resolve=>{
        return new_eventId(user).then((eventId)=>{
            let filename = "events"+eventId+".txt";
            fs.mkdir(`./Storage/users/${user}/events/${eventId}`,(err)=>{
                if(err){}
                else{
            fs.writeFile(`./Storage/users/${user}/events/${eventId}/${filename}`,details,(err)=>{
                if(err) console.log(err)
            })
        }
    })
        db.query("insert into events(userid,eventsId,Name,starting_date) values(?,?,?,?)",[user,eventId,name,start_date],(err,rows)=>{
            if(err) resolve(0)
            resolve(eventId)
        })
    })
})
}

function events_members(user,emails,eventId){
    for(x of emails.split(",")){

        db.query("select * from login where email=?",[x],(err,rows)=>{

            if(rows.length>0){
                db.query("insert into e_members(userid,eventsId,agentId) values(?,?,?)",[user,eventId,rows[0].userid],(err,rows)=>{
                    if(err) {}
                })
            }else{
                console.log("in else part")
                fs.readFile(`./Storage/users/${user}/events/${eventId}/event${eventId}_members.json`,'utf-8',(err,data)=>{
                    if(err){
                        let temp={"members":[{
                            "email":x
                        }]}
                        temp=JSON.stringify(temp)
                        fs.writeFile(`./Storage/users/${user}/events/${eventId}/event${eventId}_members.json`,temp,(err)=>{
                            if(err){}
                        })
                    }else{
                         data = JSON.parse(data);
                        let a = {
                            "email":x
                        }
                        data.members.push(a)
                        data=JSON.stringify(data)
                        fs.writeFile(`./Storage/users/${user}/events/${eventId}/event${eventId}_members.json`,data,(err)=>{
                            if(err){}
                        })
                    }
                })
            }
        })
    }
}
    
    

function fetch_agents(user){
    return new Promise(resolve=>{
        db.query("select * from login where userid in(select relid from relations where userid=?)",[user],(err,rows)=>{
            resolve(rows.length >0?rows:0)
        })
    })
}
function agent_access(userid,to){
    return new Promise(resolve=>{
        db.query("select * from chats where userid=? and to_id=?",[userid,to],(err,rows)=>{
            resolve(rows.length>0?1:0)
        })
    })
}

module.exports={
    get_data:get_data,
    new_task:new_task,
    fetch_agents:fetch_agents,
    new_event:new_event,
    events_members:events_members,
    agent_access:agent_access
}