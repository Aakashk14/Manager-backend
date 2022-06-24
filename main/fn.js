const { flushSync } = require("fullcalendar")
const db = require("../database/config")
const fs = require('fs')
const req = require("express/lib/request")

function generate_rand(user,events){
    return new Promise(resolve=>{
        var string = "abcdefgh@ijklmnopqrstuvwxyz1234567890"
            var str="";
                          
                  for(let i=0;i<10;i++){
                     var rand = (Math.random()*36).toString().split(".");
                     str = str + string[rand[0]];
            }
            console.log("",str)
            if(events){
                db.query("select * from e_details where userid=? and identity=?",[user,str],(err,rows)=>{
                    if(rows.length==0) generate_rand
                    resolve(str)
                })
                generate_rand()
            }else{
            resolve(str);
        
            }
        }
    )
}
 function token_chk(req,res,next){
    if(req.session.token==req.body.token || req.session.token==req.query.token){
        next()
    }else{
        res.redirect("/error")
    }
}

function new_taskId(user){
    return new Promise(resolve=>{
    db.query("select taskId from tasks where userid=? order by taskId desc ",[user],(err,rows)=>{

        resolve(rows.length>0?rows[0].taskId+1:1)


    })

})
}
function new_eventId(user){
    return new Promise(resolve=>{
    db.query("select eventsId from events where userid=? order by eventsId desc",[user],(err,rows)=>{

        resolve(rows.length>0?rows[0].eventsId+1:1)


    })

})
}

function message_json(user,x,id,filename,comment,Name){
 
    fs.readFile(`./Storage/users/${user}/${x}/${id}/${filename}`,(err)=>{
        if(err){
            var temp = {
                "comments":[
                    {
                    "Name":Name,
                    "msg":comment
                    }
                ]
            }
        temp=JSON.stringify(temp)
        fs.writeFile(`./Storage/users/${user}/${x}/${id}/${filename}`,temp,(err)=>{
            if(err){}
        })
        }else{
            var temp={
                "Name":Name,
                "msg":comment
            }
            fs.readFile(`./Storage/users/${user}/${x}/${id}/${filename}`,(err,data)=>{
                if(err){}
                var d = JSON.parse(data)

                d['comments'].push(temp);
                d=JSON.stringify(d)
                fs.writeFile(`./Storage/users/${user}/${x}/${id}/${filename}`,d,(err)=>{
                    if(err) console.log(err)
                })

            })
        }
    })
   
}


//   members(req.session.userid,response,req.body.emails)



module.exports={
    new_taskId:new_taskId,
    new_eventId:new_eventId,
    message_json:message_json,
    generate_rand:generate_rand,
    token_chk:token_chk
}