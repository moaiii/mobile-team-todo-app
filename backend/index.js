const ApiBuilder = require('claudia-api-builder');
const AWS = require('aws-sdk');
const api = new ApiBuilder();
const dynamoDb = new AWS.DynamoDB.DocumentClient();


api.post('/todo', function (request) { 
  var params = {
    TableName: 'team-todo-list',  
    Item: {
      id: request.body.id,
      body: request.body.body,
      assignee: request.body.assignee,
      isComplete: request.body.isComplete
    } 
  }
  return dynamoDb.put(params).promise(); 
}, { success: 201 }); 


api.get('/todo', function (request) { 
  return dynamoDb.scan({ TableName: 'team-todo-list' }).promise()
      .then(response => response.Items)
});


api.put('/todo', (req) => {
  return dynamoDb.update({
    TableName: 'team-todo-list',
    Key: {
      id: req.body.id
    },
    UpdateExpression: `set
      body = :a,
      assignee = :b,
      isComplete = :c
    `,
    ExpressionAttributeValues: {
      ':a': req.body.body,
      ':b': req.body.assignee,
      ':c': req.body.isComplete
    },
  })
  .promise()
  .then(res => res)
})

module.exports = api;
