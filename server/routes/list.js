var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.post('/', function (req, res) {
    console.log('message post was hit!');
    pool.connect(function (errorConnectingToDatabase, client, done) {
        done();
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database: ', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query('INSERT INTO list (name, message) VALUES ($1);', [req.body.item], function (errorMakingQuery, result) {
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

// router.put('/', function (req, res) {
//     console.log('message put was hit!');
//     pool.connect(function (errorConnectingToDatabase, client, done) {
//         done();
//         if (errorConnectingToDatabase) {
//             console.log('Error connecting to database: ', errorConnectingToDatabase);
//             res.sendStatus(500);
//         } else {
//             client.query('UPDATE messages SET message=$1 WHERE id=$2', [req.body.message, req.body.id], function (errorMakingQuery, result) {
//                 if (errorMakingQuery) {
//                     UPDATE books SET author = ‘Sussanna Clarke’, title=‘Jonathan Strange and Mr. Norrel’ WHERE id=‘9’;
//                     console.log('Error making database query: ', errorMakingQuery);
//                     res.sendStatus(500);
//                 } else {
//                     res.sendStatus(200);
//                 }
//             });
//         }
//     });
// });

module.exports = router;