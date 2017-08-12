var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.post('/', function (req, res) {
    console.log('message post was hit!');
    pool.connect(function (errorConnectingToDatabase, client, done) {
       
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database: ', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query('INSERT INTO list (item) VALUES ($1)', [req.body.item], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making database query: ', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
        }
    });
});

router.get('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        done(); 
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database: ', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query('SELECT * FROM list;', function (errorMakingQuery, result) {
                if (errorMakingQuery) {
                    console.log('Error making database query: ', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});

router.post('/deleteItems', function (req, res) {
    console.log('message post was hit!');
    var ids = req.body.ids.replace('"', '');
    pool.connect(function (errorConnectingToDatabase, client, done) {
       
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database: ', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query('DELETE FROM list WHERE id IN' + ids, function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making database query: ', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
        }
    });
});


module.exports = router;