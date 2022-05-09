const express = require("express");
const app=express();
const PORT=process.env.PORT | 3000;
const bodyParser = require('body-parser');

const userRoute = require("./routes/userRoute");
const {errorController} =require("./controllers/errorController");

// parse url query string
app.use(bodyParser.urlencoded({ extended: false }))

// parse data into json for sending as response
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send("Hello User")
});

app.use('/user', userRoute);

app.use(errorController);

app.listen(PORT,()=>{
    console.log(`Server started.${PORT}`);
})