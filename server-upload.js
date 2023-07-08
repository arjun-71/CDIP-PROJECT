//import './App.css';
//import React, { component } from 'react';

const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const app = express();
const mongoose = require('mongoose');
//const Image = require('./models/Image');
const path = require('path');
const { url } = require('inspector');
//const { collection } = require('./models/Image');
const MongoClient = require('mongodb').MongoClient;
const  cors = require('cors');    //work in the development of this application part for cross communication
const { spawn } = require('child_process'); // for executing the python script

/*const childPython = spawn('python3', ['test.py']);           

childPython.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

childPython.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

childPython.on('close', (code) => {
  console.log(`child process exited with code ${code}`);  //exiting statement
});
*/


//setting up the uri connection to database
var password = encodeURIComponent("z3#v5x2h");
const uri = `mongodb+srv://sshroff3:${password}@cluster0.kdfgjmm.mongodb.net/?retryWrites=true&w=majority`;
async function connect() {
    try {
   
        await mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true})
        .then(client => {
            console.log('Mongo Connected!');
           // const db = client.db('test');  //name of the data base  
           // const agenda = new Agenda({ mongo: db()});
           // const connection = db.collection('images');
            //app.locals.imageCollection = collection;
        });
       
        
    }catch(error){
        console.error(error);
    }
}

//setting up the aws s3 connection for uploadation 
 s3 = new aws.S3({         //s3 bucket credentials 
    params: {
    apiVersion: '2006-03-01',
    Key: 'AKIA2C3B4H2ZUZ2EPKL4',
    secret: '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'
    }
});



//if add condition???????

const options = {
    apiVersion: '2006-03-01',
    params: {
      Bucket: process.env['synchronousupload']
    },
    accessKeyId: process.env['AKIA2C3B4H2ZUZ2EPKL4'],
    secretAccessKey: process.env['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'],
    signatureVersion: 'v4'
  }


  
  //console.log('options', options)
   //var s3 = new aws.S3(options)

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'synchronousupload',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
});







//connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');  //changed
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const id = uuid();
        const filePath = `images/${id}${ext}`; //changed
        Image.create({ filePath: filePath })
            .then(() => {
                cb(null, filePath)
            });
    }
})

  /*                                        //if condition to distinguish between first and second s3 buckets
const options2 = {                          //for second s3 bucket for storage 
    apiVersion: '2006-03-01',
    params: {
      Bucket: process.env['synchronousupload2']
    },
    accessKeyId: process.env['AKIA2C3B4H2ZUZ2EPKL4'],
    secretAccessKey: process.env['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'],
    signatureVersion: 'v4' 
  }
  console.log("options2",options2);

  var s3_2 = new aws.S3(options2)

  const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');  //changed
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const id = uuid();
        const filePath = `images/${id}${ext}`; //changed
        Image.create({ filePath: filePath })
            .then(() => {
                cb(null, filePath)
            });
    }
})
*/


  



//const upload = multer({ storage }); // or simply { dest: 'uploads/' }
app.use(express.static('public'));
//app.use(express.static('uploads'));

//using a GET command 
app.get("/api", (req, res) => {    //the api url parameter makes a get request
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})


app.post('/upload', upload.array('avatar'), (req, res) => {
   return res.json({ status : 'OK' , uploaded : req.files.length});
});

app.get('/images', (req, res) => {
   // Image.find()
   //     .then((images) => {
  //          return res.json({ status: 'OK', images});
   //     })
});
connect();

app.listen(3005, () => console.log('App is listening...'));   //python site will be called

const childPython = spawn('python3', ['test.py']);           

childPython.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

childPython.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

childPython.on('close', (code) => {
  console.log(`child process exited with code ${code}`);  //exiting statement
});
