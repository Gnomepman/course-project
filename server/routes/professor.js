const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const nodemailer = require("nodemailer");
const collection = "professors";

recordRoutes.route("/professor").get(function (req, res) {
    let db_connect = dbo.getDb();

    db_connect
        .collection(collection)
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/professor/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };
    
    db_connect
        .collection(collection)
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/professor/add").post(function (req, response) {
    let db_connect = dbo.getDb();

    let myobj = {
        name: req.body.name,
        surname: req.body.surname,
        sex: req.body.sex,
        email: req.body.email,
        cafedra: req.body.cafedra,
        listOfSubjects: [],
    };

    db_connect.collection(collection).insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

recordRoutes.route("/professor/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    let newvalues = {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            sex: req.body.sex,
            email: req.body.email,
            cafedra: req.body.cafedra,
        },
    };
    db_connect
        .collection(collection)
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 professor-document updated");
            response.json(res);
        });
});

recordRoutes.route("/professor/delete/:id").delete(async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect.collection(collection).deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 professor-document deleted");
        response.json(obj);
    });

    db_connect.collection("subjects").updateMany(
        {
            professorId: ObjectId(req.params.id)
        },
        {
            $unset: {
                professorId: 1,
            }
        },
        function (err) {
            if (err) throw err;
        }
    );

    if(!req.body.email){
        return;
    }

    // https://wiki.ukr.net/ManageIMAPAccess
    let transporter = nodemailer.createTransport({
        host: 'smtp.ukr.net',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_ADRESS,
            pass: process.env.MAIL_PASS
        }
    })

    transporter.sendMail({
        from: process.env.MAIL_ADRESS,
        to: req.body.email,
        subject: "Повідомлення з університету",
        html: `<h3>Інформація щодо вашого звільнення</h3>
            <p>Повідомляємо, що викладач ${req.body.name} ${req.body.surname} був звільнений з нашого університету</p>
        `,
    });
});

module.exports = recordRoutes;