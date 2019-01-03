const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todoapp', (err,db) => {
    if(err) {
        console.log('Unable to connect to database server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate(
        {_id: new ObjectID('5c2e4295c86424a75491eb24')}, 
        {$set: {completed: true}},
        { returnOriginal: false}
        ).then((result) => {
            console.log(result);
        });
    db.close();
    
});