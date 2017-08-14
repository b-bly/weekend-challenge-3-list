var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.post('/', function (req, res) {
    console.log('list post was hit!');
    pool.connect(function (errorConnectingToDatabase, client, done) {
       
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database: ', errorConnectingToDatabase);
            res.sendStatus(500);
        } else { //insert new item
            client.query('INSERT INTO list (item, complete) VALUES ($1, $2)', [req.body.item, req.body.complete], function (errorMakingQuery, result) {
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
        } else { //select the whole table
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
    console.log('list deleteItems was hit!');
    var ids = req.body.ids.replace('"', ''); //remove "" from the ids string
    //Not sure if this is the best way to delete multiple entries, but it works
    pool.connect(function (errorConnectingToDatabase, client, done) {
       
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database: ', errorConnectingToDatabase);
            res.sendStatus(500);
        } else { //delete all entries with the ids sent
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

router.post('/updateToComplete', function (req, res) {
    console.log('updateToComplete post was hit!');
    var id = req.body.id // id of table row to update
    var status = req.body.complete // y or n
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database: ', errorConnectingToDatabase);
            res.sendStatus(500);
        } else { //query to update complete status of a row
            client.query('UPDATE list SET complete = '+ status +' WHERE id=\'' + id + '\';', function (errorMakingQuery, result) {
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