const mysql = require("mysql2");

const Connection = mysql.createConnection({
    host:"mysql.railway.internal",
    user:"root",
    password:"hKkjXicXHcwbeuTxAAgEogRUAZvLUtWG",
    database:"invoice_management_system",
    port: 3306
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