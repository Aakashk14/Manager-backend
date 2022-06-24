const db = require("./config")
const fs = require('fs')

function seqid(){
    
   return new Promise(resolve=>{
        db.query("select * from login order by userid desc",(err,rows)=>{
            resolve(rows.length>0?rows[0].userid+1:1)
        })
    }
    )
}
   

function login(email,password){
    return new Promise(resolve=>{
        db.query("select * from login where email=? and password=?",[email,password],(err,rows)=>{
            if(rows.length >0){
               
                resolve(rows[0])
            }else{
                resolve(0)
            }
        })
    })
}
//signup(email,password,0).then((agentid)=>{

function signup(email,password,level,name,firstlogin){
    return new Promise(resolve=>{

        return seqid().then((userid)=>{
            if(level==1){
            fs.mkdir(`./Storage/users/${userid}`,{recursive:true},(err)=>{
                if(err) console.log(err)
            })
            fs.mkdir(`./Storage/users/${userid}/tasks`,{recursive:true},(err)=>{
                if(err) console.log(err)
            })
            fs.mkdir(`./Storage/users/${userid}/events`,{recursive:true},(err)=>{
                if(err) console.log(err)
            })
        }
        db.query("insert into login(userid,email,password,level,name,firstlogin) values(?,?,?,?,?,?)",[userid,email,password,level,name,firstlogin],(err,rows)=>{
            if(err) resolve(-1)
            resolve(userid)
        })
    })
})
}
//     await users.update_profile(req.body.name,req.body.password,req.session.userid,0)

function update_profile(name,password,email,userid,firstlogin){
    return new Promise(resolve=>{
        db.query("update login set name=?, password=?,firstlogin=?,email=? where userid=?",[name,password,firstlogin,email,userid],(err,rows)=>{
            if(err) resolve(0)
            resolve(1)
        })
    })
}

function removing_dir(userid){
    return new Promise(resolve=>{
    db.query("select userid from login where userid in(select relId from relations where userid=?)",[userid],(err,rows)=>{
        
        for(x of rows){
            
                fs.access(`./Storage/users/${x}`,function(err){
                    if(err) {console.log(err)}
                    else{
                fs.rmdir(`./Storage/users/${x}`,{recursive:true},function(err){
                    if(err) {}
                })

            }})
           
        }
    
        fs.rmdir(`./Storage/users/${userid}`,{recursive:true},function(err){
            if(err){}
        })
        })
    
        resolve()
    })
}
function delete_account(userid){
    return new Promise(resolve=>{

    db.query("delete from login where userid in(select relId from relations where userid=?)",[userid],(err,rows)=>{
        if(err) {}
        db.query("delete from login where userid=?",[userid],(err)=>{
            if(err) {}
            resolve(1)
        })
    })

})
}
module.exports={
    login:login,
    signup:signup,
    update_profile:update_profile,
    delete_account:delete_account,
    removing_dir:removing_dir
}