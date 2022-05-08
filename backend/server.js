const express = require("express");
const app=express();
const PORT=process.env.PORT | 3000;
const bodyParser = require('body-parser');

const userRoute = require("./routes/userRoute");
const {error404Controller,error500Controller} =require("./controllers/errorController");

// parse url query string
app.use(bodyParser.urlencoded({ extended: false }))

// parse data into json for sending as response
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send("Hello User")
});

app.use('/user', userRoute);

app.use(error404Controller);
app.use(error500Controller);

app.listen(PORT,()=>{
    console.log(`Server started.${PORT}`);
})