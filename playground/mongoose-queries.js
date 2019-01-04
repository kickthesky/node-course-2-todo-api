const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {ObjectID} = require('mongodb');

//var id = '5c2f8e88bd09740d942acf69';
var id = '5c2f8e88bd09740d942acf6911';

if(!ObjectID.isValid(id)) {
    return console.log('ID not valid');
}
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('ID not found!');
    }
    console.log('Todo by ID', todo);
}).catch((e) => console.log(e));
