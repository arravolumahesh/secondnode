const express=require("express");
const mysql=require("mysql");
const app=express()

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.json());


const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root123",
    database:"mysqldb",
})

// con.connect((err)=>{
//     if (err){
//         console.log(err)
//     }else{
//         console.log("Connected")
//     }
// })

con.connect((err)=>{
        if (err){
            console.log(err)
        }else{
           var sql="CREATE TABLE IF NOT EXISTS mytable (id int,name varchar(20),subject varchar(20),marks int)";
           con.query(sql,(err,result)=>{
            if (err){
                console.log(err)
            }else{
                console.log("Table Created")
            }
           })
        }
    })

app.get("/fetch",(req,res)=>{
    con.query("select * from mytable",function(err,result,fields){
        if (err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.get("/fetchbyid/:id",(req,res)=>{
    const fetched=req.params.id;
    con.query("select * from mytable where id=?",fetched,(err,result)=>{
        if (err){
            console.log(err)
        }else{
           res.send(result)
        }
    })
})

app.post("/fetchpost",(req,res)=>{
    const id=req.body.id;
    const name=req.body.name;
    const subject=req.body.subject;
    const marks=req.body.marks;
    
    con.query("INSERT INTO mytable values(?,?,?,?)",[id,name,subject,marks],(err,result)=>{
        if (err){
            console.log(err)
        }else{
           res.send("Posted")
        }
    })
})

app.post("/postlist",(req,res)=>{

    req.body.forEach(element => {
        const id=element.id;
        const name=element.name;
        const subject=element.subject;
        const marks=element.marks;
        
        con.query("INSERT INTO mytable values(?,?,?,?)",[id,name,subject,marks],(err,result)=>{
            if (err){
                return res.send(err)
            }
        })
    });

    return res.send("List Posted")
})



app.put("/update/:id",(req,res)=>{
    const upid=req.params.id;
    const name=req.body.name;
    const subject=req.body.subject;
    const marks=req.body.marks;

    con.query("UPDATE mytable SET name=?,subject=?,marks=? WHERE id=?",[upid,name,subject,marks],(err,result)=>{
        if (err){
            console.log(err)
        }else{
            res.send("Updated")
        }
    })
})

app.delete("/deletedata",(req,res)=>{
    const delid=req.body.id;
    con.query("DELETE FROM mytable",delid,(err,result)=>{
        if (err){
            console.log(err)
        }else{
            if (result.affectedRows==0){
                console.log("id not present")
            }else{
                res.send("Deleted")
            }
        }
    })
})

app.get("/getmax",(req,res)=>{
    con.query("select max(marks) as maxmark from mytable",(err,result)=>{
        if (err){
            console.log(err)
        }else{
            res.send(result)
            let data=JSON.parse(JSON.stringify(result));
            console.log(data[0].maxmark)
        }
    })
})

app.listen(4000,(err)=>{
    if (err){
        console.log(err)
    }else{
        console.log("Port on 4000")
    }
})