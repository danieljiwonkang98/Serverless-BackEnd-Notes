//* Route: PATCH /note

const AWS = require("aws-sdk");
const util = require("./util.js");
const moment = require("moment");

AWS.config.update({ region: "ap-northeast-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  let item = JSON.parse(event.body).Item;
  item.user_id = util.getUserId(event.headers);
  item.user_name = util.getUserName(event.headers);
  item.expires = moment().add(90, "days").unix();

  let data = await dynamodb
    .put({
      TableName: tableName,
      Item: item,
      ConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": timestamp,
      },
      ExpressionAttributeValues: {
        ":t": item.timestamp,
      },
    })
    .promise();

  try {
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(item, 2),
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
