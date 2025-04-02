const AWS = require('aws-sdk');

// DynamoDB の設定
const dynamoConfig = {
  region: process.env.AWS_REGION || 'ap-northeast-1'
};

// ローカルDynamoDBの場合はエンドポイントを設定
if (process.env.DYNAMODB_ENDPOINT) {
  dynamoConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
}

const dynamoDB = new AWS.DynamoDB(dynamoConfig);
const documentClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);

// テーブル名
const RESERVATIONS_TABLE = 'Reservations';

// テーブルが存在するか確認
const tableExists = async (tableName) => {
  try {
    await dynamoDB.describeTable({ TableName: tableName }).promise();
    return true;
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
};

// 予約テーブルを作成
const createReservationsTable = async () => {
  const params = {
    TableName: RESERVATIONS_TABLE,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    await dynamoDB.createTable(params).promise();
    console.log(`テーブル ${RESERVATIONS_TABLE} を作成しました`);
  } catch (error) {
    console.error(`テーブル ${RESERVATIONS_TABLE} の作成に失敗しました:`, error);
    throw error;
  }
};

// メイン処理
const setupDynamoDB = async () => {
  try {
    // テーブルが存在するか確認
    const exists = await tableExists(RESERVATIONS_TABLE);
    
    if (!exists) {
      // テーブルがなければ作成
      await createReservationsTable();
      
      // テーブルが作成されるまで待機
      console.log('テーブルが作成されるのを待っています...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.log(`テーブル ${RESERVATIONS_TABLE} は既に存在します`);
    }
    
    console.log('DynamoDBのセットアップが完了しました');
  } catch (error) {
    console.error('DynamoDBのセットアップに失敗しました:', error);
  }
};

// エクスポート
module.exports = {
  setupDynamoDB,
  dynamoDB,
  documentClient,
  RESERVATIONS_TABLE
};

// このファイルが直接実行された場合はセットアップを実行
if (require.main === module) {
  setupDynamoDB();
} 