const express=require('express');
const cors = require('cors');
require('dotenv').config();
// const jwt=require('jsonwebtoken');
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const res = require('express/lib/response');


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
        const myItemCollection=client.db('warehouse-management').collection('myItems');
        const latestItemCollection=client.db('warehouse-management').collection('latestItems');
        const marketPlaceCollection=client.db('warehouse-management').collection('marketPlace');

        // app.post('/login',async(req,res)=>{
        //     const user=req.body;
        //     const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
        // })
        // res.send({accessToken});
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
        //My Items
        app.get('/myItems', async(req,res)=>{
            const query={};
            const cursor=myItemCollection.find(query);
            const items=await cursor.toArray();
            res.send(items);
        });
        app.get('/myItems/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const item=await myItemCollection.findOne(query);
            res.send(item);
        });
       
        //Latest Items
        app.get('/latestItems', async(req,res)=>{
            const query={};
            const cursor=latestItemCollection.find(query);
            const items=await cursor.toArray();
            res.send(items);
        });
        app.get('/latestItems/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const item=await latestItemCollection.findOne(query);
            res.send(item);
        });
        //MarketPlace
        app.get('/marketPlace', async(req,res)=>{
            const query={};
            const cursor=marketPlaceCollection.find(query);
            const items=await cursor.toArray();
            res.send(items);
        });
        app.get('/marketPlace/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const item=await marketPlaceCollection.findOne(query);
            res.send(item);
        });
        //Post
        app.post('/items', async(req,res)=>{
            const newItem=req.body;
            const result=await itemCollection.insertOne(newItem);
            res.send(result);
        })

        //Update restock
        app.put('/restokeItems/:id', async(req,res)=>{
            const id=req.params.id;
            console.log(id);
            const updatedQuantity=req.body.quantity;
            const filter={_id:ObjectId(id)};
            const options={upsert:true};
            const updatedDoc={
                $set: {
                    quantity:updatedQuantity,
                }
            };
            const result=await itemCollection.updateOne(filter,updatedDoc,options);
            res.send(result);
            console.log(result);
        })
        //update deliver
        app.put("/deliverItems/:id", async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body.deliver;
            console.log(updatedProduct.quantity);
            console.log(typeof updatedProduct.quantity);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
              $set: {
                quantity: updatedProduct,
              },
            };
            const result = await itemCollection.updateOne(filter,updatedDoc,options
            );
            res.send(result);
          });

        //Delete
        app.delete('/items/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const result=await itemCollection.deleteOne(query);
            res.send(result);
        });
        //My Item Delete
        app.delete('/myItems/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const result=await myItemCollection.deleteOne(query);
            res.send(result);
        });
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