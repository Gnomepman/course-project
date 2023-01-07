const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const collection = "users";

recordRoutes.route("/user").get(function (req, res) {
    let db_connect = dbo.getDb();
    db_connect
        .collection(collection)
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/user/login/:login/password/:password").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {
        login: req.params.login,
        password: req.params.password,
    };
    db_connect
        .collection(collection)
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/user/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect
        .collection(collection)
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/user/add").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { login: req.body.login };
    db_connect
        .collection(collection)
        .find(myquery).toArray(function (err, result) {
            if (err) throw err;
            if (result.length !== 0) {
                response.status(400).json("User with such login already exists");
                return;
            } else {
                let myobj = {
                    login: req.body.login,
                    password: req.body.password,
                    rights: req.body.rights,
                };
                db_connect.collection(collection).insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    response.json(res);
                });
            }
        });
});

recordRoutes.route("/user/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { login: req.body.login };

    db_connect
        .collection(collection)
        .find(myquery).toArray(function (err, result) {
            if (err) throw err;
            if (result.length !== 0) {
                response.status(400).json("User with such login already exists");
                return;
            } else {
                let myquery = { _id: ObjectId(req.params.id) };

                let newvalues = {
                    $set: {
                        login: req.body.login,
                        password: req.body.password,
                        rights: req.body.rights,
                    },
                };
                db_connect
                    .collection(collection)
                    .updateOne(myquery, newvalues, function (err, res) {
                        if (err) throw err;
                        console.log("1 user-document updated");
                        response.json(res);
                    });
            }
        });
});

recordRoutes.route("/user/delete/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection(collection).deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 user-document deleted");
        response.json(obj);
    });
});

module.exports = recordRoutes;