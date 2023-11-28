const express = require('express');
const fs = require("fs");
const winston = require('winston');

const app = express();
app.use(express.json());

const PORT = process.env.port || 3000;


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});


app.get('/status', (request, response) => {
    const status = {
        status: "Running successfully"
    };
    response.send(status);
});

app.get('/list', (request, response) => {
    response.send([
        {
            username: 'Franco',
            name: 'Franco Jesus',
            age: 33
        },
        {
            username: 'Megan',
            name: 'Andrea Megan',
            age: 26
        }
    ]);
});


app.get('/users', (req, res) => {
    const json = fs.readFileSync('assets/mock.json', 'utf-8');
    logger.log('info', json);
    res.send(JSON.parse(json));
});

app.get('/employees', (req, res) => {
    setTimeout(() => {
        const json = fs.readFileSync('assets/employees.json', 'utf-8');
        logger.log('info', json);
        res.send(JSON.parse(json));    
    }, 5000);
});

app.post('/error-test', (req, res) => {
    const error = new Error('Error test, something went wrong');
    logger.log('error', error.message);
    res.status(500).json({
        error: {
            message: error.message
        }
    });
});

app.get('/empty', (req, res) => {
    res.status(404).send();
});


var apm = require('elastic-apm-node').start({
    serviceName: 'node',
    secretToken: 'zN3g0dH6QR2DxyXSBT',
    serverUrl: 'https://a85ebbb36611416da5593777c1531375.apm.us-east-1.aws.cloud.es.io:443',
    environment: 'local'
});

app.listen(PORT, () => {
    console.log("Server listening on PORT: ", PORT);
});

