const reservationService = require('../services/reservationService');

exports.handler = async (event) => {
  try {
    const id = event.pathParameters.id;
    
    // 予約の存在確認
    const existingReservation = await reservationService.getReservationById(id);
    if (!existingReservation) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ 
          message: `ID ${id} の予約が見つかりませんでした` 
        })
      };
    }
    
    await reservationService.deleteReservation(id);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 
        message: `ID ${id} の予約が正常に削除されました`,
        id
      })
    };
  } catch (error) {
    console.error('予約の削除に失敗しました:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 
        message: '予約の削除中にエラーが発生しました',
        error: error.message
      })
    };
  }
}; 