const e = require('express');
var express = require('express');
var router = express.Router();
let BlogServer = require('../models/blog');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


router.get('/', function (req, res){
  req.query.redirect;
  let redirect = null;
  if (req.query.redirect){
    redirect = req.query.redirect;
  }

  res.status(200).render('login', {redirect: redirect});
})

router.post('/', function (req, res){
    req.body.redirect;
    let redirect = null;
    if (req.body.redirect){
      redirect = req.body.redirect;
    }

    let username = null;
    let password = null;

    username = req.body.username;
    password = req.body.password;

    if(!username || !password){
        res.status(401).send();
    }
    else{
        BlogServer.authUser((err, docs) => {
            if (docs.length === 0){
                res.status(401).render('login', {redirect: redirect});
            }
            else{
                if(bcrypt.compareSync(password, docs[0]["password"])){

                  let privateKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
                  var token = jwt.sign({
                    "exp": Math.floor(Date.now() / 1000) + 2*(60 * 60),
                    "usr": username
                  },
                  privateKey, { algorithm: 'HS256'});
                  res.cookie("jwt", token);
                  if (redirect == null){
                    res.status(200).send("Authentication Successful!");
                  }
                  else {
                    res.redirect(302, redirect);
                  }
                }
                else{
                    res.status(401).render('login', {redirect: redirect});
                }           
            }
          }, username);
    }
})

module.exports = router;