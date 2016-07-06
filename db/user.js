var database = require('./neo4j');
var Crud = require('../classes/crud');

module.exports = new Crud(database, {
    create:"create (u:User {id:{id}, name:{name}, title:{title}, rank:{rank}}) return u",
    locate:"match (u:User {id:{id}}) return u",
    update:"match (u:User {id:{id}}) set u += {fields} return u",
    delete:"match (u:User {id:{id}}) detach delete u return {data:{id:{id}}} as User"
});