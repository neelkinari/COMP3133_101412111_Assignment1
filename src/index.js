const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Ensure this file exists
const typeDefs = require('./schema/typeDefs');
const userResolvers = require('./resolvers/userResolvers');
const employeeResolvers = require('./resolvers/employeeResolvers');

dotenv.config();  // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers: [userResolvers, employeeResolvers],
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();