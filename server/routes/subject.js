const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const collection = "subjects";

recordRoutes.route("/subject").get(function (req, res) {
    let db_connect = dbo.getDb();

    db_connect
        .collection(collection)
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/topSubject").get(function (req, res) {
    let db_connect = dbo.getDb();

    db_connect
        .collection(collection)
        .aggregate([
            {
                $unwind: "$listOfGroups"
            },
            {
                $group: {
                    _id: '$_id',
                    name: { "$first": "$name" },
                    professorId: { "$first": "$professorId" },
                    listOfGroups: {
                        $push: "$listOfGroups"
                    },
                    numberOfGroups: { $sum: 1 }
                }
            },
            {
                $sort: { numberOfGroups: -1 }
            }
        ]
        )
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });

    // db_connect
    //     .collection(collection)
    //     .aggregate([{$group: {
    //         _id: "$_id",
    //         name: { "$first": "$name" },
    //         professorId: { "$first": "$professorId" },
    //         listOfGroups: {
    //             $push: "$listOfGroups"
    //         },
    //         size: {
    //             $sum: 1
    //         }
    //     }}])
    //     .toArray(function (err, result) {
    //         if (err) throw err;
    //         res.json(result);
    //     });
});

recordRoutes.route("/subject/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect
        .collection(collection)
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/subject/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    let myquery = { name: req.body.name };
    db_connect
        .collection(collection)
        .find(myquery).toArray(function (err, result) {
            if (err) throw err;
            if (result.length !== 0) {
                response.status(400).json("Subject with such name already exists");
                return;
            } else {
                let myobj = {
                    name: req.body.name,
                    listOfGroups: [],
                };
                db_connect.collection(collection).insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    response.json(res);
                });
            }
        });
});

recordRoutes.route("/subject/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { name: req.body.name };

    db_connect
        .collection(collection)
        .find(myquery).toArray(function (err, result) {
            if (err) throw err;
            if (result.length !== 0) {
                response.status(400).json("Subject with such name already exists");
                return;
            } else {
                let myquery = { _id: ObjectId(req.params.id) };

                let newvalues = {
                    $set: {
                        name: req.body.name,
                        professor: req.body.professor,
                    },
                };
                db_connect
                    .collection(collection)
                    .updateOne(myquery, newvalues, function (err, res) {
                        if (err) throw err;
                        console.log("1 subject-document updated");
                        response.json(res);
                    });
            }
        });
});

recordRoutes.route("/subject/delete/:id").delete(async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect.collection(collection).deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 subject-document deleted");
        response.json(obj);
    });

    db_connect.collection("groups").updateMany(
        {
            listOfSubjects: ObjectId(req.params.id)
        },
        {
            $pull: {
                listOfSubjects: ObjectId(req.params.id),
            }
        },
        function (err) {
            if (err) throw err;
        }
    );

    db_connect.collection("professors").updateMany(
        {
            listOfSubjects: ObjectId(req.params.id)
        },
        {
            $pull: {
                listOfSubjects: ObjectId(req.params.id),
            }
        },
        function (err) {
            if (err) throw err;
        }
    );
});

recordRoutes.route("/subject/:subjectId/group/:groupId").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.subjectId) };

    db_connect.collection(collection).findOneAndUpdate(myquery,
        {
            $addToSet: {
                listOfGroups: ObjectId(req.params.groupId),
            }
        },
        function (err, res) {
            if (err) throw err;
            response.json(res);
        });

    db_connect.collection("groups").updateOne(
        {
            _id: ObjectId(req.params.groupId)
        },
        {
            $addToSet: {
                listOfSubjects: ObjectId(req.params.subjectId),
            }
        },
        function (err) {
            if (err) throw err;
        });
});

recordRoutes.route("/subject/:subjectId/group/:groupId").delete(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.subjectId) };

    db_connect.collection(collection).findOneAndUpdate(myquery,
        {
            $pull: {
                listOfGroups: ObjectId(req.params.groupId),
            }
        },
        function (err, res) {
            if (err) throw err;
            response.json(res);
        });

    db_connect.collection("groups").updateOne(
        {
            _id: ObjectId(req.params.groupId)
        },
        {
            $pull: {
                listOfSubjects: ObjectId(req.params.subjectId),
            }
        },
        function (err) {
            if (err) throw err;
        });
});

recordRoutes.route("/subject/:subjectId/professor/:professorId").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.subjectId) };

    db_connect.collection(collection).findOneAndUpdate(myquery,
        {
            $set: {
                professorId: ObjectId(req.params.professorId),
            }
        },
        function (err, res) {
            if (err) throw err;
            response.json(res);
        });

    db_connect.collection("professors").updateOne(
        {
            _id: ObjectId(req.params.professorId)
        },
        {
            $addToSet: {
                listOfSubjects: ObjectId(req.params.subjectId),
            }
        },
        function (err) {
            if (err) throw err;
        });
});

recordRoutes.route("/subject/:subjectId/professor/:professorId").delete(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.subjectId) };

    db_connect.collection(collection).findOneAndUpdate(myquery,
        {
            $unset: {
                professorId: ObjectId(req.params.professorId),
            }
        },
        function (err, res) {
            if (err) throw err;
            response.json(res);
        });

    db_connect.collection("professors").updateOne(
        {
            _id: ObjectId(req.params.professorId)
        },
        {
            $pull: {
                listOfSubjects: ObjectId(req.params.subjectId),
            }
        },
        function (err) {
            if (err) throw err;
        });
});

module.exports = recordRoutes;