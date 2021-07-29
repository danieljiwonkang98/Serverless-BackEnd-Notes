//* Route: DELETE /note/t/{timestamp}

const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-northeast-1" });

const util = require("./util");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  let timestamp = parseInt(event.pathParameters.timestamp);

  let params = {
    TableName: tableName,
    Key: {
      user_id: util.getUserId(event.headers),
      timestamp: timestamp,
    },
  };

  await dynamodb.delete(params).promise();

  try {
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        message: "Delete Successful :)",
      }),
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown Error",
      }),
    };
  }
};
