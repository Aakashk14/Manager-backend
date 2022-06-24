const req = require("express/lib/request");
const db = require("../database/main")

module.exports=function(io){
    var clients={}
    var num = 0;
    function html(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    io.use(function(socket, next) {
           
        x_session(socket.request, {}, next);
    })
        io.on("connection",async (socket)=>{
            clients[socket.request.session.userid]=socket.id
           
          
        

    socket.on('message',async(data)=>{
     let access = await db.agent_access(socket.request.session.userid,data.user)
     if(access==1){
        send_to = clients[data.user]
        myid=socket.request.session.candidate?socket.request.session.myid:socket.request.session.org
        //msg=html(data.msg)
       io.to(send_to).emit("message",{message:data.msg,user:socket.request.session.userid})
     }
    })
})
}


    