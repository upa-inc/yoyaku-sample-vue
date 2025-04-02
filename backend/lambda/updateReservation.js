const reservationService = require('../services/reservationService');

exports.handler = async (event) => {
  try {
    const id = event.pathParameters.id;
    const reservationData = JSON.parse(event.body);
    
    // 必須フィールドのバリデーション
    const requiredFields = ['title', 'date', 'startTime', 'endTime', 'roomNumber'];
    for (const field of requiredFields) {
      if (!reservationData[field]) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({ 
            message: `${field} は必須フィールドです` 
          })
        };
      }
    }
    
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
    
    const updatedReservation = await reservationService.updateReservation(id, reservationData);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(updatedReservation)
    };
  } catch (error) {
    console.error('予約の更新に失敗しました:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 
        message: '予約の更新中にエラーが発生しました',
        error: error.message
      })
    };
  }
}; 