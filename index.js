const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app=express();
const port=process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://AutomotiveServer:jwyKlsw8vN4KV3AT@cluster1.tbo7caf.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    await client.connect();

    const database = client.db("automotiveDB");
   const userCollection= database.collection('product')

    app.post('/products',async(req,res)=>{
      const product=req.body;
      const result = await userCollection.insertOne(product);
      res.send(result);
      console.log(result)

    })


    app.get('/products',async(req,res)=>{
      const result=await userCollection.find().toArray();
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Server is running')
});

app.listen(port,()=>{
    console.log(`server running at port :${port}`)
})