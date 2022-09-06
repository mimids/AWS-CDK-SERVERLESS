import * as AWS from 'aws-sdk';

const BDD_TABLE = process.env.BDD_TABLE ? process.env.BDD_TABLE : null;
const bdd = new AWS.DynamoDB.DocumentClient();


export const handler = async(event:any={}):Promise<any> => { 
    if(BDD_TABLE){
        const testItem = JSON.parse(event.body);
        const id = testItem.id;

        const params = {
            TableName : BDD_TABLE,
            Key: {
                id,
              },
          }

try{
    
    const data = await bdd.delete(params).promise()
    
    return { statusCode : 200 , body: "Retour de la base " + JSON.stringify(data)}

}catch(er){
    return { statusCode : 500, body : "Table inaccessible"} + JSON.stringify(er);
}
    }else{
        return {statusCode : 403, body : "table "}
    }

    // if (!event.body) { 
    //     return { statusCode: 400, body: "Paramètres erronés, il n'y a pas de body" }; 
    // } 
    
    // return { statusCode: 201, body: JSON.stringify(event.body) }; 
} 