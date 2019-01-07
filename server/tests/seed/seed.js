const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var {Todo} = require('./../../models/todos');
var {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId, email: 'bob@example.com', password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
            }
        ]
    },
    {
        _id: userTwoId, email: 'joe@example.com', password: 'userTwoPass'
    }
];

const todos = [
    { _id: new ObjectID(), text: 'First test todo' },
    { _id: new ObjectID(), text: 'Second test todo', completed: true, completedAt: 12345 }
];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};


module.exports = {todos, users, populateTodos, populateUsers};