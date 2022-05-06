const express=require('express');
const port=process.env.PORT || 5000;

const app=express();
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Running Warehouse-management Server');
});

app.listen(port,()=>{
    console.log("Listening to port",port);
})