const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


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
    const userCollection = database.collection('product');
    const addToCartCollection = database.collection('carted product');

    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await userCollection.insertOne(product);
      res.send(result);
      console.log(result)

    })


    app.get('/products', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })



    app.get('/mycart', async (req, res) => {
      const result = await addToCartCollection.find().toArray();
      res.send(result);
    })

    app.get('/mycart/:email', async (req, res) => {
      const user = req.params.email;
      const query = { email: user };
      const cursor = addToCartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })



    app.post('/mycart', async (req, res) => {
      const product = req.body;
      const result = await addToCartCollection.insertOne(product)
      res.send(result)
    })



    // add to cart

    app.post('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await addToCartCollection.findOne().toArray();
      res.send(result);
    })


    // delete data

    app.delete('/mycart/:id', async (req, res) => {
      const id = req.params.id;
    
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    
      const query = { _id: new ObjectId(id) };
      try {
        const result = await addToCartCollection.deleteOne(query);
    
        if (result.deletedCount > 0) {
          res.json({ message: 'Document deleted successfully' });
        } else {
          res.status(404).json({ error: 'Document not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });


    // get after delete

    app.get('/mycart/:id',async(req,res)=>{
      
    })
    

    // update data

    // app.get('/products/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   const query={
    //     _id:new ObjectId(id)
    //   }
    //   const result =await userCollection.findOne(query);
    //   res.send(result)
    // })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server is running')
});

app.listen(port, () => {
  console.log(`server running at port :${port}`)
})