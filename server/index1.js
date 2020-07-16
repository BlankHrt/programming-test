const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.


const typeDefs = gql`
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
    getAllTodo: [Todo]
  }
  
  type Mutation {
    createTodo(input: TodoInput): Todo
    updateTodo(id: String,name: String,desc: String): Todo
    deleteTodo(id: String): Todo
  }
`;

const fakeDatabase = [];

const resolvers = {
    Query: {
        getAllTodo: () => {
            return fakeDatabase;
        },
    },
    Mutation: {
        createTodo: (root, args, { name, desc}) => {
            var id = require('crypto').randomBytes(10).toString('hex');
            fakeDatabase.push({
                id, name, desc 
            })
            return;
        },
        updateTodo: (root, args,{ id, name, desc }) => {
            console.log(id, name, desc)
            if (!id) {
                throw new Error();
            }
            const index = fakeDatabase.findIndex(e => e.id == id)
            fakeDatabase[index].name = name
            fakeDatabase[index].desc = desc
            return;
        },
        deleteTodo: (root, args,{ id }) => {
            if (!id) {
                throw new Error();
            }
            const index = fakeDatabase.findIndex(e => e.id == id)
            fakeDatabase.splice(index, 1)
            return;
        },
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs, resolvers,
    context: async ({req})=>req.body
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});