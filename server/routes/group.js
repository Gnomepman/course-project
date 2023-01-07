const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const collection = "groups";

recordRoutes.route("/group").get(function (req, res) {
    let db_connect = dbo.getDb();
    db_connect
        .collection(collection)
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/group/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect
        .collection(collection)
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/group/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    let myquery = { name: req.body.name };
    db_connect
        .collection(collection)
        .find(myquery).toArray(function (err, result) {
            if (err) throw err;
            if (result.length !== 0) {
                response.status(400).json("Group with such name already exists");
                return;
            } else {
                let myobj = {
                    name: req.body.name,
                    cafedra: req.body.cafedra,
                    listOfStudents: [],
                    listOfSubjects: [],
                };
                db_connect.collection(collection).insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    response.json(res);
                });
            }
        });
});

recordRoutes.route("/group/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { name: req.body.name };

    db_connect
        .collection(collection)
        .find(myquery).toArray(function (err, result) {
            if (err) throw err;
            if (result.length !== 0) {
                response.status(400).json("Group with such name already exists");
                return;
            } else {
                let myquery = { _id: ObjectId(req.params.id) };
                let newvalues = {
                    $set: {
                        name: req.body.name,
                        cafedra: req.body.cafedra,
                    },
                };

                db_connect
                    .collection(collection)
                    .updateOne(myquery, newvalues, function (err, res) {
                        if (err) throw err;
                        console.log("1 group-document updated");
                        response.json(res);
                    });
            }
        });
});

recordRoutes.route("/group/delete/:id").delete(async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect.collection(collection).deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 group-document deleted");
        response.json(obj);
    });

    db_connect.collection("subjects").updateMany(
        {
            listOfGroups: ObjectId(req.params.id)
        },
        {
            $pull: {
                listOfGroups: ObjectId(req.params.id),
            }
        },
        function (err) {
            if (err) throw err;
        }
    );

    db_connect.collection("students").updateMany(
        {
            groupId: ObjectId(req.params.id)
        },
        {
            $unset: {
                groupId: 1,
            }
        },
        function (err) {
            if (err) throw err;
        }
    );
});

recordRoutes.route("/group/:groupId/student/:studentId").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.groupId) };

    db_connect.collection(collection).findOneAndUpdate(myquery,
        {
            $addToSet: {
                listOfStudents: ObjectId(req.params.studentId),
            }
        },
        function (err, res) {
            if (err) throw err;
            response.json(res);
        });

    db_connect.collection("students").updateOne(
        {
            _id: ObjectId(req.params.studentId)
        },
        {
            $set: {
                groupId: ObjectId(req.params.groupId),
            }
        },
        function (err) {
            if (err) throw err;
        });
});

recordRoutes.route("/group/:groupId/student/:studentId").delete(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.groupId) };

    db_connect.collection(collection).findOneAndUpdate(myquery,
        {
            $pull: {
                listOfStudents: ObjectId(req.params.studentId),
            }
        },
        function (err, res) {
            if (err) throw err;
            response.json(res);
        });

    db_connect.collection("students").updateOne(
        {
            _id: ObjectId(req.params.studentId)
        },
        {
            $unset: {
                groupId: 1,
            }
        },
        function (err) {
            if (err) throw err;
        });
});

module.exports = recordRoutes;