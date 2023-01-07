const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const nodemailer = require("nodemailer");
const collection = "students";

recordRoutes.route("/student").get(function (req, res) {
    let db_connect = dbo.getDb();
    
    db_connect
        .collection(collection)
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/student/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect
        .collection(collection)
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/student/add").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.name,
        surname: req.body.surname,
        sex: req.body.sex,
        email: req.body.email,
    };

    db_connect.collection(collection).insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

recordRoutes.route("/student/update/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    let newvalues = {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            sex: req.body.sex,
            email: req.body.email,
        },
    };

    db_connect
        .collection(collection)
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 student-document updated");
            response.json(res);
        });
});

recordRoutes.route("/student/delete/:id").delete(async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id) };

    db_connect.collection(collection).deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 student-document deleted");
        response.json(obj);
    });

    db_connect.collection("groups").updateMany(
        {
            listOfStudents: ObjectId(req.params.id)
        },
        {
            $pull: {
                listOfStudents: ObjectId(req.params.id),
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
            user: "derkach782003@ukr.net",
            pass: "CUv9FI6VK9SIESnR"
        }
    })

    let info = await transporter.sendMail({
        from: 'derkach782003@ukr.net',
        to: req.body.email,
        subject: "Повідомлення з університету",
        html: `<h3>Інформація щодо вашого відрахування</h3>
            <p>Повідомляємо, що студент ${req.body.name} ${req.body.surname} був відрахований з нашого університету</p>
        `,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});

module.exports = recordRoutes;