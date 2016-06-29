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
}
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

module.exports = neo4j;