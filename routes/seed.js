var router = require('express').Router();
var db = require('../db/neo4j');
var User = require('../db/user');

router.get("/seed/reset", function(inReq, inRes){
    db.purge()
    .then(function(inSuccess){
        return User.create({id:"1", name:"Administrator", title:"Administrator", rank:"admin"});
    })
    .then(function(inSuccess) {
        inRes.json(inSuccess);
    })
    .catch(function(inError){
        inRes.json(inError);
    });
});

module.exports = router;