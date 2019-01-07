const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/user');

var {todos, users, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'This is a test.';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });

    });
    it('should not create todo with invalid body data', (done) => {

        var text = '';
        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            })
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return 404 with invalid id', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
    it('should return 404 with incorrect id', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should return delete a doc', (done) => {
        var hexId = todos[1]._id.toHexString();
        
        request(app)
            .delete(`/todos/${hexId}`)            
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(todos[1]._id).then((todo) => {
                    expect(todo).not.toBeTruthy();
                    done();
                }).catch((err) => done(err));
            });
    });
    it('should return 404 with invalid id', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
    it('should return 404 with incorrect id', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update and return todo doc', (done) => {
        var hexId = todos[0]._id.toHexString();
        var body = { text: 'This is changed', completed: true};
        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('This is changed');
                expect(res.body.todo.completed).toBeTruthy();
                expect(typeof(res.body.todo.completedAt)).toBe('number');
            })
            .end(done);
    });
    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var body = { text: 'This is also been changed', completed: false};
        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('This is also been changed');
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).not.toBeTruthy();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a new user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(email);
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err) => done(err));
            });

    });
    it('should return validation errors if request invalid', (done) => {
        var email = 'bademail';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                User.find().then((users) => {
                    expect(users.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            });
    });
    it('should not create a user if the email is in use', (done) => {
        var email = 'bob@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                User.find().then((users) => {
                    expect(users.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            });
    });
});