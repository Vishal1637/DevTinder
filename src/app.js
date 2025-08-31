const express = require('express');

const app =express();

app.use("/test",(req,res)=>{
    res.send("heelo from the server");
});

app.get("/user",(req,res)=>{
res.send("today i have used the get version of API")
});

app.post("/user",(req,res)=>{
    // console.log("save data to database");
    res.send("Data is send to the database successfully");
    });


app.listen(3000,()=>{
    console.log("server is successfully started");
});