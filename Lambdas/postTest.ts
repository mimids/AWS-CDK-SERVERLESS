import * as AWS from 'aws-sdk';
import { v4 } from "uuid";
import { Test } from './test.model';

const BDD_TABLE = process.env.BDD_TABLE ? process.env.BDD_TABLE : null;
const bdd = new AWS.DynamoDB.DocumentClient();


export const handler = async (event: any = {}): Promise<any> => {
    if (BDD_TABLE) {
        const testItem = JSON.parse(event.body);
        const params = {
            TableName: BDD_TABLE,
            Item: {
                id: v4(),
                ...testItem
            }
        }

        try {

            const data = await bdd.put(params).promise();

            return { statusCode: 200, body: "Retour de la base " + JSON.stringify(params) }

        } catch (er) {
            return { statusCode: 500, body: "Table inaccessible" } + JSON.stringify(er);
        }
    } else {
        return { statusCode: 403, body: "table " }
    }
} 