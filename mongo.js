const conn = require('mongodb')
const mongo = conn.MongoClient
const express = require("express")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const fs = require("fs")
app = express();
var url = "mongodb://127.0.0.1:27017"
mongo.connect(url, (err, database)=>{
    if(err)
    {
        console.log(err)
    }
    else
    {
        db = database.db("PhoneNumberDB")
        app.get("/api", (req,res)=>{
            res.json("Welcome to the number api . Here you can search for some phone numbers . To signup go to /api/register/yournumberhere/yourpasswordhere")
        })
        app.get("/api/register/:phone/:password", (req,res)=>{
            let number = req.params.phone
            let password = req.params.password
            num = password.length
            if(isNaN(number))
            {
                res.json("Either you did not give us a number or you have to be better at choosing passwords")
            }
            else
            {
                let find = {phone:number}
                db.collection("users").findOne(find, (err,result)=>{
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {

                        console.log(result)
                        if(result == null)
                        {
                            password = "$sha12346#"+password
                            hashed_password = crypto.createHash("sha512").update(password).digest("hex")
                            let data = {phone:number,password:hashed_password}
                            db.collection("users").insertOne(data, (err, result)=>
                            {
                                if(err)
                                {
                                    console.log(err)
                                }
                                else
                                {
                                    res.json({message:"Successfully registered",Id:result.number})
                                }
                            })
                        }
                        else{
                             res.json("Phone Number is already registered")
                        }
                
                    }
                })
            }
        })
        app.post("/api/login/:phone/:password", (req,res)=>{
            let phone = req.params.phone
            let password = req.params.password
            password = "$sha12346#"+password
            hashed_password = crypto.createHash("sha512").update(password).digest("hex")
            let data = {phone:phone,password:hashed_password}
            db.collection("users").findOne(data, (err,result)=>{
                if(err)
                {
                    console.log(err)
                }
                else{
                    if(result != null){
                        const token = jwt.sign({_id:result._id}, "fddggdgregergerr");
                        res.header("X-auth-token", token)
                        res.json({
                            message:"Here is your api token . Your token is also available in header",
                            token:token,
                            id:result._id,
                            num:result.phone
                        })
                    }
                    else{
                        res.json({
                            message:"Username or password does not exist"
                        })
                    }
                    console.log(result)
                }
            })

        })
        app.post("/api/private/addmusic/:id/:name", (req,res)=>{
            a = req.query.token
            try{
                ver = jwt.verify(a, "fddggdgregergerr")
                id = req.params.id
                name = req.params.name
                data = {id:id,name:name}
                //db.collection("users").insertOne(data, (err, result)=>
                db.collection("music").insertOne(data, (err,result)=>{
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    res.json({
                        message:"Inserted Succesfully"
                    })
                }
                })
            }
            catch(err){
                res.json("Dude get the fuck out")
            }
        })
        app.get("/api/music/:id", (req,res)=>{
            a = req.query.token
            try{
                ver = jwt.verify(a, "fddggdgregergerr")
                id = req.params.id
                data = {id:id}
                db.collection("music").findOne(data, (err,result)=>{
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    if(result==null)
                    {
                        res.json("The song does not exist and probably the server crashed")
                    }
                    else{
                        //go to line 140
                        fil = "/home/debabrata/node/music/"+result.name
                        console.log(fil)
                        fs.readFileSync(fil, (err,data)=>{
                            if(err)
                            {
                                console.log(err)
                            }
                            else{
                                res.send(data)
                            }
                        })
                        
                    }
                    fs.readFile(fil, (err,data)=>{
                        if(err)
                        {
                            console.log(err)
                        }
                        else
                        {
                            res.send(data)
                        }
                    })
                }
                })
            }
            catch(err){
                res.json("Dude get the fuck out")
            }
        })
        app.get("/api/addtoplaylist/:name", (req,res)=>{
            a = req.query.token
            try{
                ver = jwt.verify(a, "fddggdgregergerr")
                id = req.params.id
                name = req.params.name
                data = {name:name,token:a}
                db.collection("playlist").insertOne(data, (err,result)=>{
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    res.json("Added to playlist")
                }
                })
            }
            catch(err){
                res.json("Dude get the fuck out")
            }
        })

//The api stores the name of the song along with your unique json web token id when you add a song to playlist . When you check for your
//playlist it fetches the name of the songs and then use the name to get the id of the song from the music database
//Since declaring global variable in node js is a pain in the ass . The api then stores the id in textfile with the  unique token name

        app.get("/api/playlist/", (req,res)=>{
            a = req.query.token
            fileName = "/tmp/"+a+".txt"
            try{
                ver = jwt.verify(a, "fddggdgregergerr")
                db.collection("playlist").find({}, {token:a}).toArray((err,result)=>{
                    num = result.length
                    let i = 0
                    while(i<num)
                    {
                        song = result[i].name
                        kiba = {name:song}
                        db.collection("music").findOne(kiba, (err,hmm)=>{
                            console.log(j)
                            j = hmm.id+"\n"
                            fs.appendFileSync(fileName, j)
                        })
                        i=i+1
                    }
                    
                })
            }
            catch(err){
                console.log(err)
            }
        })
        app.listen(3000, ()=>{
            console.log("Connected")
        })
    }
})