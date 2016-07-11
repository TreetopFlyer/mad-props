var router = require('express').Router();
var db = require('../db/neo4j');

router.get('/contests', function(inReq, inRes){
    db.query("match (c:Contest {open:'true'}) return c")
    .then(function(inSuccess){
        console.log(inSuccess);
        inRes.render("users", {layout:"main"});
    }, function(inFailure){

    });

});

module.exports = router;