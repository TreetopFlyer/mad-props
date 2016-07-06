var database = require('./neo4j');
module.exports = new database.Crud({
    create:"match (author:User {id:{idAuthor}}) optional match (about:User {id:{idAbout}}) optional match (contest:Contest {id:{idContest}}) create (author)-[:wrote]->(s:Story {id:{id}, story:{story}})-[:recognize]->(about), (s)-[:enter]->(contest) return s",
    locate:"match (s:Story {id:{id}}) return s",
    update:"match (s:Story {id:{id}}) set s += {fields} return s",
    delete:"match (s:Story {id:{id}}) detach delete s return {data:{id:{id}}} as Story"
});