const express = require('express')
require('dotenv').config({ path: __dirname + '/.env' });
var cors = require('cors')
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json())

app.post('/enroll/employee', (req, res) => {
    const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("rentit").collection("employees");
        collection.insertOne({ name: req.body.name, id: req.body.id, email: req.body.email, location: req.body.location, joiningDate: req.body.joiningDate, lastDate: req.body.lastDate, phone: req.body.phone }, function (err, response) {
            var post = response.ops[0];
            if (post) {
                res.json({ id: post._id })
            } else {
                res.json({ error: "Error while storing employee, please try again after sometime" })
            }
        })
    });
    client.close();
})

app.get('/employee-details', (req, res) => {
    const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            res.json({ error: err.message })
        }
        const collection = client.db("rentit").collection("employees");
        collection.find().sort({ "name": 1 }).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            client.close();
        });
    })
})

app.post('/delete/employee', (req, res) => {
    const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            res.json({ error: err.message })
        }
        const collection = client.db("rentit").collection("employees");
        collection.deleteOne( { "_id": ObjectID(req.body.data.value) }, function(err) {
            if (err) throw err;
            res.json({ result: 0 })
            client.close();
          })
    })
})

app.post('/update/employee', (req, res) => {
    const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) {
            res.json({ error: err.message })
        }
        const collection = client.db("rentit").collection("employees");
        collection.updateOne({ "_id": ObjectID(req.body.data._id)}, {$set: {"name": req.body.data.name, "id": req.body.data.id, "email": req.body.data.email, "location": req.body.data.location, "phone": req.body.data.phone, "joiningDate": req.body.data.joiningDate, "lastDate": req.body.data.lastDate}}, function(err){
            if (err) throw err
                res.json({ result: 0 })
        })
    })
})

app.listen(5000, () => console.log('Server started on port 5000.'))