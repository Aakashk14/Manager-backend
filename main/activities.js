const fs = require('fs')
function fetch_act(userid){
    return new Promise(resolve=>{
fs.readFile(`./Storage/users/${userid}/activities.json`,'utf-8',(err,data)=>{
    if(err) resolve(0)
    
    resolve(data)
})
    })
}
//            activities.post_act(user,"task new",1,0)

function post_act(user,type,admin,email){
   

if(admin==0){
if(type=="task"){
    let str  =`${email} completed the task`
}
}else{

    if(type=="new agent"){
        var str=`You added Agent ${email}`
    }else if(type=="event"){
        var str=`You created a new Event`
    }else if(type=="agent delete"){
        var str=`You deleted Agent ${email}`
    }else if(type="task new"){
        var str=`You created a new task`
    }
    fs.readFile(`./Storage/users/${user}/activities.json`,(err,data)=>{
        if(err){
          if(admin==1){
            var data ={"me":[{
                "id":1,
                "msg":str
            }]}
        }else{
            var data ={"Agents":[{
                "id":1,
                "msg":str
            }]}
        }
            data=JSON.stringify(data)
            fs.writeFile(`./Storage/users/${user}/activities.json`,data,(err)=>{
                if(err) console.log(err)
            })
        

        }else{
           data=JSON.parse(data);
           if(admin==1){
           id=data.me[data.me.length-1].id+1;
           let tmp = {
               "id":id,
               "msg":str
           }
           
           data.me.push(tmp)
           data=JSON.stringify(data)
        }else{
            id=data.Agents[data.Agents.length-1].id+1;
            let tmp = {
                "id":id,
                "msg":str
            }
            
            data.Agents.push(tmp)
            data=JSON.stringify(data)
        }
           fs.writeFile(`./Storage/users/${user}/activities.json`,data,(err)=>{
               if(err) console.log(err)
           })
           
        }
    })
}
}



module.exports={
    fetch_act:fetch_act,
    post_act:post_act
}