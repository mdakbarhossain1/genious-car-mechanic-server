const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = 5000;

app.use(cors());
app.use(express.json());

// user guniousCar
// password L5gJLMeV7ayJzvcj

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anxgc.mongodb.net/guniousCar?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("guniousCar");
        const servicesCollection = database.collection("services");


        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        // GET API
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET SINGLE SERVICE
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);

        })

        // DELETE API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })






    }
    finally {
        // await client.close()
    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('i m from server')
});

app.listen(port, () => {
    console.log('server listining', port);
});