const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middle were
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8s6gcn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const phoneStoreCollection = client.db('mobileStore').collection('mobileCategory')
        const phoneStoreCategoryCollection = client.db('mobileStore').collection('mobileCategoryAllCard')
        const bookingsCollection = client.db('mobileStore').collection('bookings')

        app.get('/mobileCollection', async(req ,res) =>{
            const query = {};
            const options = await phoneStoreCollection.find(query).toArray();
            res.send(options)
        })

        app.get('/home/category/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {category : id};
            const resallerAllCategory = await phoneStoreCategoryCollection.find(query).toArray();
            res.send(resallerAllCategory)
        })

        app.get('/bookings', async (req,res) =>{
            const email = req.query.email;
            const query = {email : email};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings)
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body
            console.log(booking);
            const query ={
                email: booking.email
            }
            const alreadyBooked = await bookingsCollection.find(query).toArray();
            if(alreadyBooked.length){
                const message = `You already have a booking on ${booking.email}`
                return res.send({acknowledged : false, message}) 
            }
            const result = await bookingsCollection.insertOne(booking);
            res.send(result)
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
