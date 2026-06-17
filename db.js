const mysql = require("mysql2");

const Connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root123",
    database:"invoice_management_system"
});

Connection.connect((err)=>{
    if(err){
        console.log("connection to database failed");
        console.log(err);
        return;
        
        
    }

    console.log("my sql connected succesfully");
    
});

module.exports = Connection;