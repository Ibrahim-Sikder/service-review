const express = require('express')
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000 ;

// middleware 
app.use(cors())
app.use(express.json())

// Database user
// user : Ibrahim-Sikder1
// password : 35VaCyZxmBQ2uaiq
// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u82gun1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
async function run(){
try{
    const serviceCollection = client.db('Food-Service').collection('services');

   
   
    app.get('/services', async(req, res)=>{
        const query = {} 
        const cursor = serviceCollection.find(query);
        const services  = await cursor.toArray();
        res.send(services);
    })

    app.get('/services/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await serviceCollection.findOne(query) ;
        res.send(service)
    })

  
   

}
finally{

}
}
run().catch(err=>console.log(err))



// Default server running

app.get('/', (req, res)=>{
    res.send('Food service client project running !!')
})

app.listen(port, ()=>{
    console.log(`Food service project kaj kortece tik moto ! ${port}`)
})