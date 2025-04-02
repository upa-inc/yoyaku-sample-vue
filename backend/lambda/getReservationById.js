const reservationService = require('../services/reservationService');

exports.handler = async (event) => {
  try {
    const id = event.pathParameters.id;
    
    const reservation = await reservationService.getReservationById(id);
    
    if (!reservation) {
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
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(reservation)
    };
  } catch (error) {
    console.error('予約の取得に失敗しました:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 
        message: '予約の取得中にエラーが発生しました',
        error: error.message
      })
    };
  }
}; 