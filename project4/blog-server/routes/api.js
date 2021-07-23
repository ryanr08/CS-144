const e = require('express');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { ReplSet } = require('mongodb');
let BlogServer = require('../models/blog');

let privateKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

router.get('/', function (req, res){
    let username = req.query.username;
    if (req.query.postid){
        let postid = parseInt(req.query.postid);
        if (!postid){
            res.sendStatus(400);
            return;
        }
    }
    let postid = parseInt(req.query.postid);

    let token = req.cookies.jwt;
    jwt.verify(token, privateKey, function(err, decoded) {
        if (err) {
            res.status(401).send();
        }
        else {
            if (decoded.usr !== username){
                res.status(401).send();
            }
            else{
                if (!postid) {
                    BlogServer.getUsersPosts((err, docs) => {
                        res.status(200).send(docs);
                    }, username, 1);
                }
                else {
                    BlogServer.getUserPostid((err, docs) => {
                        if (docs.length === 0){
                            res.status(404).send();
                        }
                        else{
                            res.status(200).send(docs[0]);
                        }
                    }, username, postid);
                }
            }
        }
      });
})

router.delete('/', function (req, res) {
    let username = req.query.username;
    let postid = parseInt(req.query.postid);

    if (!postid){
        res.sendStatus(400);
        return;
    }

    let token = req.cookies.jwt;
    jwt.verify(token, privateKey, function(err, decoded) {
       if (err) {
           res.status(401).send();
       }
       else {
           if (decoded.usr !== username){
               res.status(401).send();
           }
           else{
                BlogServer.deletePost((err, docs) => {
                    if (err) {
                        res.send(err);
                    }
                    else
                        if (docs["deletedCount"] === 0){
                            res.status(404).send();
                        }
                        else{
                            res.status(204).send();
                        }
                }, username, postid);
           }
       }
     });
})

router.post('/', function (req, res) {
    let username = req.body.username;
    let postid = parseInt(req.body.postid);
    let title = req.body.title;
    let body = req.body.body;

    if (body === undefined || title === undefined || username === undefined || postid === undefined){
        console.log(body + title + username + postid)
        res.sendStatus(400);
        return;
    }

    let token = req.cookies.jwt;
    jwt.verify(token, privateKey, function(err, decoded) {
        if (err || decoded.usr !== username) {
            res.status(401).send();
        }
        else {
            if (postid === 0){
                BlogServer.insertPost((err, docs) => {
                    if (err) {
                        res.sendStatus(400);
                    }
                    else
                        var str = '{"postid": ' + String(docs["ops"][0]["postid"]) + ', "created": ' + String(docs["ops"][0]["created"]) + ', "modified": ' + String(docs["ops"][0]["modified"]) + '}';
                        var obj = JSON.parse(str);
                        res.status(201).send(obj);
                }, username, title, body);
            }
            else if (postid > 0){
                BlogServer.updatePost((err, docs, modified) => {
                    if (docs["modifiedCount"] === 1){
                        var str = '{"modified": ' + String(modified) + '}';
                        var obj = JSON.parse(str);
                        res.status(200).send(obj);
                    }
                    else {
                        res.sendStatus(404);
                    }  
                }, username, title, body, postid);
            }
            else {
                res.sendStatus(400);
            }
        }});    
})

module.exports = router;