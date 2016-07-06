var database = require('./neo4j');
var Crud = require('../classes/crud');

module.exports = new Crud(database, {
    create:"create (c:Contest {name:{name}, open:{open}, id:{id}}) return c",
    locate:"match (c:Contest {id:{id}}) return c",
    update:"match (c:Contest {id:{id}}) set c += {fields} return c",
    delete:"match (c:Contest {id:{id}}) detach delete c return {data:{id:{id}}} as Contest"
});