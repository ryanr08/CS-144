let client = require('../db');

// get contents of one specific post
function getUserPostid(callback, username, postid) {
    let BlogServer = client.db('BlogServer').collection('Posts');

    BlogServer.find({$and: [{username: {$eq: username}}, {postid: {$eq: postid}}]}).toArray((err, docs) => {
        callback(err, docs);
    });
}

// get all posts with postid >= start
function getUsersPosts(callback, username, start) {
    let BlogServer = client.db('BlogServer').collection('Posts');

    BlogServer.find({$and: [{username: {$eq: username}}, {postid: {$gte: start}}]}).sort({postid: 1}).toArray((err, docs) => {
        callback(err, docs);
    });
}

function authUser(callback, username) {
    let BlogServer = client.db('BlogServer').collection('Users');
    BlogServer.find({username: {$eq: username}}).toArray((err, docs) => {
        callback(err, docs);
    });
}

function deletePost(callback, username, postid) {
    let BlogServer = client.db('BlogServer').collection('Posts');
    BlogServer.deleteOne({$and: [{username: {$eq: username}}, {postid: {$eq: postid}}]}, ((err, docs) => {
        callback(err, docs);
    }));
}

function insertPost(callback, username, title, body) {
    let BlogServer_users = client.db('BlogServer').collection('Users');
    let postid = null;
    BlogServer_users.findOne({username: {$eq: username}}, ((err, docs) => {
        postid = docs["maxid"] + 1;
        BlogServer_users.updateOne({username: {$eq: username}}, {$inc: {"maxid": 1}});
        let BlogServer = client.db('BlogServer').collection('Posts');
        BlogServer.insertOne({"postid": postid, "username": username, "created": Date.now(), "modified": Date.now(), "title": title, "body": body}, ((err, docs) => {
            callback(err, docs);
        }));
    }));
}

function updatePost(callback, username, title, body, postid) {
    let BlogServer = client.db('BlogServer').collection('Posts');
    let modified = Date.now()
    BlogServer.updateOne({$and: [{username: {$eq: username}}, {postid: {$eq: postid}}]}, {$set: {"title": title, "body": body, "modified": modified}}, ((err, docs) => {
        callback(err, docs, modified);
    }));
}

module.exports = {
    getUserPostid,
    getUsersPosts,
    authUser,
    deletePost,
    insertPost,
    updatePost
};