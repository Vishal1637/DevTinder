const express = require('express');

const app =express();

const { adminAuth ,userAuth} = require("./middlewares/auth");

//handle all the middleware for all Get,Post request...

app.use("/admin",adminAuth);

app.post("/user",(req,res)=>{
res.send("User is succesfully logged in to the app");
});

app.get("/user/data",userAuth,(req,res)=>{
res.send("user data send");
});
app.get("/admin/getalldata", (req, res) => {
    res.send("sends all the data");

});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("deleted a user");
    });

app.listen(3000,()=>{
    console.log("server is successfully started");
});
