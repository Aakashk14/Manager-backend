const express = require('express')
const { renderScrollShim } = require('fullcalendar')
const users = require('../database/users')
const { generate_rand,act_file}=require('./fn')
const fs = require('fs')
const router = express.Router()


router.get("/",(req,res)=>{
if(req.session.userid){
    res.redirect("/home")
}else{
    res.render("login.ejs")
}
})
router.get("/signup",(req,res)=>{
    res.sendFile("signup.html",{root:"./"})
})

router.post("/login",async(req,res)=>{
    await users.login(req.body.email,req.body.password).then(async(response)=>{
        if(response!=0){
            
            req.session.userid=response.userid;
            req.session.level=response.level
            req.session.email=response.email
            req.session.token= await generate_rand()
            fs.readdir(`./Storage/users/${req.session.userid}`,function(err,files){
                let found=0;
                for(x of files){
                    if(x.startsWith("profile")){
                        req.session.dp=`./Storage/users/${req.session.userid}/${x}`
                        found=1;
                        break;
                    }

                }

                if(found==0){
                    req.session.dp='./Storage/default.png'
                }
                req.session.save()

            })

            if(response.firstlogin==1){
                res.redirect("/update")
            }else{
            req.session.name=response.Name
            
            let token=await generate_rand()
            

            res.cookie("name",req.session.name)
            req.session.token=token
        
            
            res.redirect("/home")
        }}else{
            res.redirect("/?error=1")
        }

    })
    

})

router.post("/signup",async(req,res)=>{
    let result = await users.signup(req.body.email,req.body.password,1,req.body.name,0)
    if(result!=0){

        req.session.userid=result;
        req.session.level=1
        req.session.email=req.body.email
        fs.readdir(`./Storage/users/${req.session.userid}`,function(err,files){
            let found=0;
            for(x of files){
                if(x.startsWith("profile")){
                    req.session.dp=`./Storage/users/${req.session.userid}/${x}`
                    found=1;
                    break;
                }
            }
            if(found==0){
                req.session.dp='./Storage/default.png'
            }
        })



        res.redirect("/home")
    }else{
        res.redirect("/?exist=1")
    }
    
})

router.get("/update",(req,res)=>{
    res.render("update.ejs",{token:req.session.token})

})
router.post("/update/user",async(req,res)=>{
     await users.update_profile(req.body.name,req.body.password,req.session.email,req.session.userid,0)
     res.redirect("/home")
})

router.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/")
})
module.exports=router