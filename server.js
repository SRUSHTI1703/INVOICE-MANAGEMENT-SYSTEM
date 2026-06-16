const express = require("express");

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("server is running");
})

app.get("/about",(req,res)=>{
    res.send("this is the about section");
});

app.post("/customers",(req,res)=>{
    console.log(req.body);

    res.send("customer recieved");
    
})

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`server is ruunning on port ${PORT}`);
    
})