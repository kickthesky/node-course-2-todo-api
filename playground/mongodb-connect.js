//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/Todoapp', (err,db) => {
    if(err) {
        console.log('Unable to connect to database server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false 
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert TODO', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Bob Hansen',
    //     age: 50,
    //     location: 'Menomonee Falls, WI'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert user', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    db.close();
    
});