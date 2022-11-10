const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000 ;

// middleware 
app.use(cors())
app.use(express.json())

// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u82gun1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// jwt verify token
function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send({message: 'Unauthorized access '})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            res.status(403).send({message: 'unauthorized access'})
        }
        req.decoded = decoded ;
        next()
    })
 }

 
async function run(){
try{
    const serviceCollection = client.db('Food-Service').collection('services');
    const reviewCollection = client.db('Food-Service').collection('reviews');
    const addServiceCollection = client.db('Food-Service').collection('addServices')


    // JWT api 
    app.post('/jwt', (req, res)=>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRETE, {expiresIn: '1h'})
        console.log(user)
        res.send({token})
    })
    
   // add service api 
   app.post('/addServices', async (req, res)=>{
    const addServices = req.body ;
    const result = await addServiceCollection.insertOne(addServices);
    console.log(result)
    res.send(result)
   })

    
   // review api 
   app.post('/review', async (req, res)=>{
    const review = req.body ;
    const result = await reviewCollection.insertOne(review);
    res.send(result)
   })

   // get review api 
   app.get('/review', async (req, res)=>{
    let query = {};
    if(req.query.email){
        query = {
            email: req.query.email 
        }
    }
    const cursor = reviewCollection.find(query);
    const review = await cursor.toArray();
    res.send(review)
   })
    // review delete api 
    app.delete('/review/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
    })

  


   // for home page service find  query
    app.get('/services', async(req, res)=>{
        const query = {} 
        const cursor = serviceCollection.find(query);
        const services  = await cursor.limit(3).toArray();
        res.send(services);
    })
    // see all service 
    app.get('/allService', async(req, res)=>{
        const query = {} 
        const cursor = serviceCollection.find(query);
        const services  = await cursor.toArray();
        res.send(services);
    })

   // service details api 

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



// default api 

app.get('/', (req, res)=>{
    res.send('Food service project running !!')
})

app.listen(port, ()=>{
    console.log(`I am running finally ! ${port}`)
})