const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const fs =require('fs-extra');
const fileUpload = require('express-fileupload');

//const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = 5000;



app.use(bodyParser.json());
app.use(cors());
app.use(express.static('creatives'));
app.use(fileUpload());


//app.use(bodyParser.urlencoded({extended: true}));
const user = 'creativeUser';
const pass = 'Bangladesh';
const databasename ='creativeAgent';


const uri = "mongodb+srv://creativeUser:Bangladesh@cluster0.4zce5.mongodb.net/creativeAgent?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology:true });
client.connect(err => {
    const collection = client.db("creativeAgent").collection("courses");
    const reviewCollection = client.db("creativeAgent").collection("reviews");
    const addServiceCollection = client.db("creativeAgent").collection("addservices");



    //Add review

    app.post('/addreview',(req,res) => {
        const reviews = req.body;
        console.log(reviews);
        reviewCollection.insertOne(reviews)
        .then(result => {
            res.send(result.insertedCount>0)
        })
    })

//Add orders
    app.post('/addorders', (req, res) => {
        const orders = req.body;
        console.log(orders);
        collection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

//adminAddServices

app.post('/adminAddService',(req,res) => {
    const file = req.files.file;
    const name = req.body.name;
    const details = req.body.details;
    // console.log(name,details,file);
    // const filePath = `${__dirname}/creatives/${file.name}`;


    // file.mv(`${__dirname}/creatives/${file.name}`,err =>{
    //     if(err){
    //         console.log(err);
    //         res.status(500).send({msg: 'Failed to upload Image'});
    //     }
    //     var newImg =fs.readFileSync(filePath);
    //     const encImg = newImg.toString('base64');

        var image ={
            // contentType: req.files.file.mimetype,
            contentType: file.mimetype,
            // size:req.files.file.size,
            size:file.size,
            img: Buffer.from(encImg,'base64')
        };


        addServiceCollection.insertOne({name,details,image})
        .then(result =>{
            // fs.remove(filePath,error =>{
                // if(error){
                    // console.log(error)
                    // res.status(500).send({msg: 'Failed to upload Image'});
                // }
                res.send(result.insertedCount>0)    
            })
           
        })
        //return res.send({name: file.name, path: `/${file.name}`});
    



//get admin service list
app.get('/adminServiceList',(req,res) =>{
    collection.find({})
    .toArray((err,documents) => {
        res.send(documents)
    })

})



    console.log('db is connected')

});


app.get('/', (req, res) => {
    res.send("Creative agency database is working")
});

app.listen(process.env.PORT || port);