const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

//middle were
app.use(cors())
app.use(express())

app.get('/', async (req,res) =>{
    res.send('mobile store server is running')
})
app.listen( port,() => console.log(` mobile store is running on ${port}`))
