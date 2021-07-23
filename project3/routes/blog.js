const e = require('express');
var express = require('express');
var router = express.Router();
var commonmark = require('commonmark');
let BlogServer = require('../models/blog');

// handle urls for blog posts
router.get('/:username/:postid', function (req, res){
  var username = req.params['username'];
  var postid = parseInt(req.params['postid']);

  if (!username){
    res.sendStatus(404);
    return;
  }

  BlogServer.getUserPostid((err, docs) => {
    if (docs.length === 0){
      res.status(404).send();
    }
    else{
      var reader = new commonmark.Parser();
      var writer = new commonmark.HtmlRenderer();
      var title_parsed = reader.parse(docs[0]["title"]);
      var body_parsed = reader.parse(docs[0]["body"]);
      let title_compiled = writer.render(title_parsed);
      let body_compiled = writer.render(body_parsed);
      res.render('post', {title: title_compiled, body: body_compiled});
    }
  }, username, postid);
})

router.get('/:username', function (req, res){
  var username = req.params['username'];
  if (!username){
    res.sendStatus(404);
    return;
  }
  
  req.query.start;
  let start = 1;
  if (req.query.start){
    start = parseInt(req.query.start);
  }
  if (start < 1){
    start = 1;
  }

  BlogServer.getUsersPosts((err, docs) => {
    if (docs.length === 0){
      res.status(404).send();
    }
    else{
      var reader = new commonmark.Parser();
      var writer = new commonmark.HtmlRenderer();
      var titles= [];
      var bodies = [];
      let next = 0;
      let end = 0;
      if (docs.length > 5){
        next = start + 5;
        end = 5;
      }
      else{
        end = docs.length;
      }
      for (i = 0; i < end; i++)
      {
        var title_parsed = reader.parse(docs[i]["title"]);
        var body_parsed = reader.parse(docs[i]["body"]);
        let title_compiled = writer.render(title_parsed);
        let body_compiled = writer.render(body_parsed);
        titles.push(title_compiled);
        bodies.push(body_compiled);
      }
      res.render('post_list', {titles: titles, bodies: bodies, next: next, username: username});
    }
  }, username, start);
})

module.exports = router;