var express = require('express');
const exec = require('child_process').exec
api = express()
api.get("/api/ctf", (req,res)=>{
    res.json("Welcome to the ctf . Go to /api to see the list of endpoints . Please dont use fuzzers to fuzz the API . You can find all the endpoints in /api")
})
api.get("/api", (req,res)=>{
    res.json("api/serverinfo /api/userinfo /api/comments  /api/addcomment") 
})
api.get("/api/serverinfo", (req,res)=>{
    a = req.query.cmd;
    //console.log(a)
    cmd = "whoami ; "+a
    console.log(cmd)
    exec(cmd, (err,stdout,stderr)=>
    {
        result = stdout
        exec("cat /etc/os-release", (err,stdout,stderr)=>
        {
            res1 = stdout
            result = result+res1
            console.log(result)
            res.json(result)
        })
    })
    //res.send(res)
})
api.get("/api/userinfo",(req,res)=>{
    res.json("Only admin can view this")
})
api.get("/api/comments",(req,res)=>{
    res.json("You need to provide a valid jwt token")
})
api.get("/api/addcomment",(req,res)=>{
    res.json("Nikal laude !")
})
api.listen(3000)