const mysql = require('mysql')

const database = mysql.createConnection({
    host:"localhost",
    user:"demo",
    password:"abcdef1",
    database:"management",
    port:3306,
    insecureAuth:true

})

module.exports=database;