//* Route: DELETE /note/t/{timestamp}

const AWS = require("aws-sdk");
const util = require("./util.js");
AWS.config.update({ region: "ap-northeast-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    let timestamp = parseInt(event.parthParameters.timestamp);
    let params = {
      TableName: tableName,
      Key: {
        user_id: util.getUserId,
        timestamp: timestamp,
      },
    };

    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
    };
  } catch (err) {
    console.log("Error ", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(
        {
          error: err.name ? err.name : "Exception",
          message: err.messsage ? err.message : "Unknown Error",
        },
        2
      ),
    };
  }
};
