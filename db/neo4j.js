var unirest = require('unirest');

var neo4j = {};

neo4j.config = {
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    endpoint:process.env.DB_URL
};

neo4j.headers = {
    'Authorization': 'Basic ' + new Buffer(neo4j.config.username+':'+neo4j.config.password).toString('base64'),
    'Content-Type': 'application/json'
};

neo4j.query = function(inQuery, inParams){
    return new Promise(function(inResolve, inReject){
        unirest
        .post(neo4j.config.endpoint)
        .headers(neo4j.headers)
        .send({"query":inQuery, "params":inParams})
        .end(function(inResponse){
            if(inResponse.body.data){
                inResolve(inResponse.body.data);
            }else{
                inReject(inResponse.body);
            }
        });
    });
};

neo4j.purge = function(){
    return neo4j.query('match (n) detach delete n')
    .then(function(inSuccess){
        return Promise.resolve(inSuccess);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

neo4j.Crud = function(inObj){
    this.cypher = inObj;
};
neo4j.Crud.prototype.locate = function(inParams){
    return neo4j.Crud.query(this.cypher.locate, inParams);
};
neo4j.Crud.prototype.create = function(inParams){
    return neo4j.Crud.query(this.cypher.create, inParams);
};
neo4j.Crud.prototype.update = function(inParams){
    return neo4j.Crud.query(this.cypher.update, inParams);
};
neo4j.Crud.prototype.delete = function(inParams){
    return neo4j.Crud.query(this.cypher.delete, inParams);
};
neo4j.Crud.query = function(inQuery, inParams){
    return neo4j.query(inQuery, inParams)
    .then(function(inSuccess){
        return Promise.resolve(inSuccess[0][0].data);
    }, function(inFailure){
        return Promise.reject(inFailure);
    });
};

module.exports = neo4j;