const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todoapp', (err,db) => {
    if(err) {
        console.log('Unable to connect to database server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5c195cce80b0e708c1d4ef5d')
    //     }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });
    // 
    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // } , (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({location: 'Greenfield, WI'}).toArray().then((docs) => {
        console.log('Menomonee Falls Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch users...');
    });

    db.close();
    
});