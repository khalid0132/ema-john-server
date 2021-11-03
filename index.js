const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')


app.use(bodyParser.json())
app.use(cors())

require('dotenv').config()
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hoios.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(process.env.DB_USER);

const port = 5000

client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
//   console.log('Database connected successfully');
            app.post('/addProduct', (req,res) => {
                const products = req.body;
                // console.log(products)
            productsCollection.insertOne(products)
            .then(result => {
                // console.log(result)
                res.send(result)
                
            })
        });


        app.get('/products', (req, res) => {
            productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
        })

        //Read single product
        app.get('/product/:key', (req, res) => {
            productsCollection.find({key: req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0])
            })
        })

        //POST productKeys from review
        app.post('/productsByKeys', (req, res) => {
            const productKeys = req.body;
            productsCollection.find({key: {$in: productKeys}})
            .toArray((err, documents) => {
                res.send(documents)
            })
        })

        //Orders post
        app.post('/addOrder', (req, res) => {
            const orders = req.body;
            ordersCollection.insertOne(orders)
            .then(result => {
                res.send(result)
            })
        })
    });

app.get('/', (req, res) => {
    res.send('Hello Khalid, you have an application')
})

app.listen(port);