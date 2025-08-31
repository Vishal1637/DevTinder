const express = require('express');

const app =express();

app.use("/test",(req,res)=>{
    res.send("heelo from the server");
});
app.listen(3000,()=>{
    console.log("server is successfully started");
});