const express = require('express');
const cors = require('cors');
const { setupDynamoDB } = require('./setup-dynamodb');

// Lambda ハンドラーのインポート
const getAllReservationsHandler = require('./lambda/getAllReservations');
const getReservationByIdHandler = require('./lambda/getReservationById');
const createReservationHandler = require('./lambda/createReservation');
const updateReservationHandler = require('./lambda/updateReservation');
const deleteReservationHandler = require('./lambda/deleteReservation');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS設定
app.use(cors());

// JSONリクエストのパース
app.use(express.json());

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({ message: '会議予約システム API サーバー' });
});

// API Gateway イベントオブジェクトをシミュレートする関数
const createEvent = (req, pathParams = {}) => {
  return {
    body: JSON.stringify(req.body),
    pathParameters: pathParams,
    queryStringParameters: req.query,
    headers: req.headers
  };
};

// Lambda レスポンスをExpressレスポンスに変換する関数
const processLambdaResponse = (lambdaResponse, res) => {
  res.status(lambdaResponse.statusCode);
  
  // ヘッダーの設定
  if (lambdaResponse.headers) {
    for (const [key, value] of Object.entries(lambdaResponse.headers)) {
      res.setHeader(key, value);
    }
  }
  
  // レスポンスの本文を送信
  if (lambdaResponse.body) {
    res.send(JSON.parse(lambdaResponse.body));
  } else {
    res.end();
  }
};

// 予約一覧の取得
app.get('/reservations', async (req, res) => {
  try {
    const event = createEvent(req);
    const lambdaResponse = await getAllReservationsHandler.handler(event);
    processLambdaResponse(lambdaResponse, res);
  } catch (error) {
    console.error('予約一覧の取得中にエラーが発生しました:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました', error: error.message });
  }
});

// 特定の予約の取得
app.get('/reservations/:id', async (req, res) => {
  try {
    const event = createEvent(req, { id: req.params.id });
    const lambdaResponse = await getReservationByIdHandler.handler(event);
    processLambdaResponse(lambdaResponse, res);
  } catch (error) {
    console.error('予約の取得中にエラーが発生しました:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました', error: error.message });
  }
});

// 新規予約の作成
app.post('/reservations', async (req, res) => {
  try {
    const event = createEvent(req);
    const lambdaResponse = await createReservationHandler.handler(event);
    processLambdaResponse(lambdaResponse, res);
  } catch (error) {
    console.error('予約の作成中にエラーが発生しました:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました', error: error.message });
  }
});

// 予約の更新
app.put('/reservations/:id', async (req, res) => {
  try {
    const event = createEvent(req, { id: req.params.id });
    const lambdaResponse = await updateReservationHandler.handler(event);
    processLambdaResponse(lambdaResponse, res);
  } catch (error) {
    console.error('予約の更新中にエラーが発生しました:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました', error: error.message });
  }
});

// 予約の削除
app.delete('/reservations/:id', async (req, res) => {
  try {
    const event = createEvent(req, { id: req.params.id });
    const lambdaResponse = await deleteReservationHandler.handler(event);
    processLambdaResponse(lambdaResponse, res);
  } catch (error) {
    console.error('予約の削除中にエラーが発生しました:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました', error: error.message });
  }
});

// サーバー起動前にDynamoDBのセットアップを実行
(async () => {
  try {
    await setupDynamoDB();
    
    // サーバーの起動
    app.listen(PORT, () => {
      console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('サーバーの起動に失敗しました:', error);
    process.exit(1);
  }
})(); 