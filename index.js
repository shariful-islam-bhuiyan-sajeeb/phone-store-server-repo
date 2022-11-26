const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken');
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
        const bookingUsersCollection = client.db('mobileStore').collection('bookingUsers')

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
                email: booking.email,
                brandName: booking.brandName,
                originalPrice:booking.originalPrice
            }
            const alreadyBooked = await bookingsCollection.find(query).toArray();
            if(alreadyBooked.length){
                const message = `You already have a booking on ${booking.email}`
                return res.send({acknowledged : false, message}) 
            }
            const result = await bookingsCollection.insertOne(booking);
            res.send(result)
        })
        
        //Booking user data........................

        app.post('/bookingUsers', async (req, res) => {
            const user = req.body;
            const result = await bookingUsersCollection.insertOne(user);
            res.send(result)
        })
        //--------------jwt--------------------
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email: email };
            const user = await bookingUsersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token })
            }
            console.log(user);
            res.status(403).send({ accessToken: '' })
        })



        app.get('/bookingUsers', async (req, res) => {
            const query = {};
            const users = await bookingUsersCollection.find(query).toArray();
            res.send(users)
        })

        app.get('/bookingUsers/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email}
            const user = await bookingUsersCollection.findOne(query)
            res.send({ isAdmin: user?.role === 'admin' });
        })
       

        
        app.put('/bookingUsers/admin/:id',  async (req, res) => {
            // const decodedEmail = req.decoded.email;
            // const query ={email: decodedEmail};
            // const user = await bookingUsersCollection.findOne(query);

            // if(user?.role !== 'admin'){
            //     return res.status(403).send({message: 'forbidden access'})
            // }

            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await bookingUsersCollection.updateOne(filter, updateDoc, options);
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
