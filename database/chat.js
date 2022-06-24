
const db = require("../database/config")
function insert_chat_a(userid,to_id,msg,turn){
   db.query("insert into chats(userid,to_id,turn,message) values(?,?,?,?)",[userid,to_id,turn,msg],(err)=>{
       if(err) {}
   })
}
function fetch_chat(userid,to){
    return new Promise(resolve=>{
    db.query("select * from chats where userid=? and to_id=?",[userid,to],(err,rows)=>{
        resolve(rows)
    })
})
}
function active_u(userid){
    return new Promise(resolve=>{
        db.query("select userid,name,email from login where userid in(select to_id from chats where userid=?)",[userid],(err,rows)=>{
            resolve(rows.length>0?rows:0)
        })
}
    )
}
function boss_info(id){
    return new Promise(resolve=>{
        db.query("select name,email,userid from login where userid=?",[id],(err,rows)=>{
            resolve(rows)
        })
    })
}
module.exports={
    insert_chat_a:insert_chat_a,
    fetch_chat:fetch_chat,
    active_u:active_u,
    boss_info:boss_info
}