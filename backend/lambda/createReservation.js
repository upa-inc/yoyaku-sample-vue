const reservationService = require('../services/reservationService');

exports.handler = async (event) => {
  try {
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
    
    const reservation = await reservationService.createReservation(reservationData);
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(reservation)
    };
  } catch (error) {
    console.error('予約の作成に失敗しました:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 
        message: '予約の作成中にエラーが発生しました',
        error: error.message
      })
    };
  }
}; 