const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('Hello, Mama! I am running.');
})



app.listen(port, () => {
    console.log('Server running');
})