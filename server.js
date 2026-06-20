const express = require("express");
const connection = require("./db.js");
const { Connection } = require("mysql2");

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("server is running");
})

app.get("/about",(req,res)=>{
    res.send("this is the about section");
});

app.post("/customers",(req,res)=>{
    const{ customer_name, email, phone} = req.body;

    const sql = `
    INSERT INTO customers
    (customer_name,email,phone)
    values(?,?,?)
    `;

    const values = [customer_name,email,phone];
    connection.query(sql,values,(err,result) => {
        if(err){
            console.log(err);
            return res.status(500).send("database error");
            
        }
        console.log(result);

        res.send("customer inserted sucessfully");
        
    });
    
    
    
})

app.get("/customers",(req,res) => {
    const sql = `SELECT * FROM customers`;

    connection.query(sql,(err,result) => {
        if(err){
            console.log(err);
            return res.status(500).send("database error")
            
        }
        console.log(result);
        res.json(result);
        
    })
});

app.get("/customers/:id",(req,res) => {
    const id = req.params.id;
    const sql = `
    SELECT * FROM customers
    WHERE customer_id = ?`

    const values = [id];

    connection.query(sql,values,(err,result)=>{
        if(err){
            console.log(err);
        return res.status(500).send("database error");
        }

        console.log(result);

        res.json(result);
         
    });

});


app.put("/customers/:id",(req,res) => {
    const id = req.params.id;
    const {customer_name,email,phone} = req.body;

    const sql = `UPDATE customers
                SET customer_name = ?,
                email = ?,
                phone = ?
                WHERE customer_id = ?`;
    const values = [customer_name,email,phone,id];
    
    connection.query (sql,values,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).send("database error");
            
        }
        console.log(result);
        res.send("customer updated sucessfully");
        
    })
})

app.delete("/customers/:id",(req,res) =>{
    const id = req.params.id;
    const sql = `DELETE FROM customers
                 WHERE customer_id = ?`;
    const values = [id];
    
    connection.query(sql,values,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).send("database error")            
        }
        console.log(result);
        if(result.affectedRows === 0){
            return res.status(404).send("customer not found");
        }
        res.send("sucessfully deleted the customer")
        
    })
})





const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`server is ruunning on port ${PORT}`);
    
})