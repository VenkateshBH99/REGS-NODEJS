const axios = require('axios').default;
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

// set headers for the request
const headers = {
    'Content-Type': 'application/json',
};

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());

app.get('/regs', function(req, res) {

    res.sendFile(__dirname + '/index.html');
});

app.post('/send-request', (req, res) => {
    const httpsUrl = 'https://te-zoot-ct.qa.paypal.com:15521/v1/risk/consumer-credit-verifications';
    // const filePath = 'sample_request.json';

    console.log("\n\nSending request from server side \n")
    console.log("Request is \n", req.body)

    // send the request with the headers and file contents as the request body
    axios.post(httpsUrl, req.body, {headers: headers})
        .then(response => {
            console.log("Received response from REGS successfully \n", response.data);
            console.log("Received response headers from REGS successfully \n", response.headers);
            res.headers = response.headers
            res.body = response.data
            res.status(200).send(response.data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error sending request');
        });
    res.redirect('/regs');
});

app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});

module.exports = app