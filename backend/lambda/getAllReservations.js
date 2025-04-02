const reservationService = require('../services/reservationService');

exports.handler = async (event) => {
  try {
    const reservations = await reservationService.getAllReservations();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(reservations)
    };
  } catch (error) {
    console.error('すべての予約の取得に失敗しました:', error);
    
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