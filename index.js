const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middle were
app.use(cors())
app.use(express())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8s6gcn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const phoneStoreCollection = client.db('mobileStore').collection('mobileCollection')

        app.get('/mobileCollection', async(req ,res) =>{
            const query = {};
            const options = await phoneStoreCollection.find(query).toArray();
            res.send(options)
        })
    }
    finally{

    }
}
run().catch(console.log());


app.get('/', async (req,res) =>{
    res.send('mobile store server is running')
})
app.listen( port,() => console.log(` mobile store is running on ${port}`))
