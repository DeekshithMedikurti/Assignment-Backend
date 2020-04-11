const express = require('express')
require('dotenv').config({ path: __dirname + '/.env' });
var cors = require('cors')
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json())

app.post('/enroll/employee', (req, res) => {
    console.log(req.body)
    const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db("rentit").collection("employees");
        collection.insertOne({ name: req.body.name, id: req.body.id, email: req.body.email, location: req.body.location, joiningDate: req.body.joiningDate, lastDate: req.body.lastDate, phone: req.body.phone }, function (err, response) {
            var post = response.ops[0];
            if(post){
                res.json({ id: post._id })
            }else{
                res.json({error: "Error while storing employee, please try again after sometime"})
            }
        })
    });
    client.close();
})

app.get('/employeedetails', (req, res) => {
    
})

app.listen(5000, () => console.log('Server started on port 5000.'))