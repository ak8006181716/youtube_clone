import express from 'express'
const app = express()

const PORT = process.env.PORT ||3000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

    app.get('/hello',(req,res)=>{
        res.send("this is the hello page");
    })




app.get("/",(req, res)=>{
    res.send("hello this is the server");
})