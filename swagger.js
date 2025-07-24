const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for managing contacts',
  },
  host: 'kater1st-cse341-node-swmg.onrender.com', // Use your actual Render host (no https)
  schemes: ['https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; // The file that defines all routes

swaggerAutogen(outputFile, endpointsFiles, doc);
