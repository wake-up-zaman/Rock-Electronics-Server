const express=require('express');
const cors = require('cors');
require('dotenv').config();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app=express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.tmtio.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() 
{
    try{
        await client.connect();
        const itemCollection=client.db('warehouse-management').collection('items');

        app.get('/items', async(req,res)=>{
            const query={};
            const cursor=itemCollection.find(query);
            const items=await cursor.toArray();
            res.send(items);
        });
        app.get('/items/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const item=await itemCollection.findOne(query);
            res.send(item);
        });
        app.post('/items', async(req,res)=>{
            const newItem=req.body;
            const result=await itemCollection.insertOne(newItem);
            res.send(result);
        })

    }
    finally{

    }

}


run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running Warehouse Server');
});

app.listen(port,()=>{
    console.log("Listening to port",port);
})