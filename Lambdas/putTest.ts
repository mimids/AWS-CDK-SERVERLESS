import * as AWS from "aws-sdk";

const BDD_TABLE = process.env.BDD_TABLE ? process.env.BDD_TABLE : null;
const bdd = new AWS.DynamoDB.DocumentClient();
const expression: Array<string | number> = [];
const valeurs: any = {};

export const handler = async (event: any = {}): Promise<any> => {
  if (BDD_TABLE) {
    const testItem = JSON.parse(event.body);

    for (let i in testItem) {
      if (i !== "id") {
        expression.push(`${i} = :${i}`);

        if(i === 'nos'){
          valeurs[`:${i}`] = Number(testItem[i]);
        }else{
        valeurs[`:${i}`] = testItem[i];
      }
      }
    }

    const id = testItem.id;
    const params = {
      TableName: BDD_TABLE,
      Key: {
        id,
      },

      ExpressionAttributeValues: valeurs,
      UpdateExpression: `set ${expression.join()}`,
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const data = await bdd.update(params).promise();

      return {
        statusCode: 200,
        body: "Retour de la base " + JSON.stringify(params),
      };
    } catch (er) {
      return (
        { statusCode: 500, body: "Table inaccessible" } +
        JSON.stringify(er) +
        JSON.stringify(params)
      );
    }
  } else {
    return { statusCode: 403, body: "table " };
  }
};
