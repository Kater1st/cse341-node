const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactsRoute = require('./contacts-api/routes/contacts');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/contacts', contactsRoute);

app.get('/', (req, res) => {
  res.send('Welcome to the Contacts API!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
