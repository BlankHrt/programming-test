var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const cors = require('cors')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input TodoInput {
    name: String
    desc: String
  }

  type Todo {
    id: String!
    name: String
    desc: String
  }

  type Query {
    getTodo(id: String!): Todo
    getAllTodo: [Todo]
  }
  
  type Mutation {
    createTodo(input: TodoInput): Todo
    updateTodo(id: String!,name: String!,desc: String!,): Todo
    deleteTodo(id: String): Todo
  }
`);

class Todo {
    constructor(id, { name, desc }) {
        this.id = id;
        this.name = name;
        this.desc = desc;
    }
}

var fakeDatabase = [];

var root = {
    getTodo: ({ id }) => {
        if (!fakeDatabase[id]) {
            throw new Error('no message exists with id ' + id);
        }
        return new Todo(id, fakeDatabase[id]);
    },
    getAllTodo: () => {
        return fakeDatabase;
    },
    createTodo: ({ input }) => {
        var id = require('crypto').randomBytes(10).toString('hex');
        input.id = id;
        fakeDatabase.push(input)
        return;
    },
    updateTodo: ({ id, name, desc }) => {
        console.log(id, name, desc)
        if (!id) {
            throw new Error();
        }
        const index = fakeDatabase.findIndex(e => e.id == id)
        fakeDatabase[index].name = name
        fakeDatabase[index].desc = desc
        return;
    },
    deleteTodo: ({ id }) => {
        if (!id) {
            throw new Error();
        }
        const index = fakeDatabase.findIndex(e => e.id == id)
        fakeDatabase.splice(index, 1)
        return;
    },
};

var app = express();
app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});