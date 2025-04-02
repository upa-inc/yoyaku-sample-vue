const { v4: uuidv4 } = require('uuid');
const { documentClient, RESERVATIONS_TABLE } = require('../setup-dynamodb');

// すべての予約を取得
const getAllReservations = async () => {
  const params = {
    TableName: RESERVATIONS_TABLE
  };

  try {
    const result = await documentClient.scan(params).promise();
    return result.Items;
  } catch (error) {
    console.error('予約の取得に失敗しました:', error);
    throw error;
  }
};

// IDによる予約の取得
const getReservationById = async (id) => {
  const params = {
    TableName: RESERVATIONS_TABLE,
    Key: { id }
  };

  try {
    const result = await documentClient.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error(`ID ${id} の予約の取得に失敗しました:`, error);
    throw error;
  }
};

// 新規予約の作成
const createReservation = async (reservationData) => {
  const reservation = {
    id: uuidv4(),
    ...reservationData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const params = {
    TableName: RESERVATIONS_TABLE,
    Item: reservation
  };

  try {
    await documentClient.put(params).promise();
    return reservation;
  } catch (error) {
    console.error('予約の作成に失敗しました:', error);
    throw error;
  }
};

// 予約の更新
const updateReservation = async (id, reservationData) => {
  // まず予約が存在するか確認
  const existingReservation = await getReservationById(id);
  if (!existingReservation) {
    throw new Error(`ID ${id} の予約は存在しません`);
  }

  const reservation = {
    ...existingReservation,
    ...reservationData,
    updatedAt: new Date().toISOString()
  };

  const params = {
    TableName: RESERVATIONS_TABLE,
    Item: reservation
  };

  try {
    await documentClient.put(params).promise();
    return reservation;
  } catch (error) {
    console.error(`ID ${id} の予約の更新に失敗しました:`, error);
    throw error;
  }
};

// 予約の削除
const deleteReservation = async (id) => {
  const params = {
    TableName: RESERVATIONS_TABLE,
    Key: { id }
  };

  try {
    await documentClient.delete(params).promise();
    return { id, deleted: true };
  } catch (error) {
    console.error(`ID ${id} の予約の削除に失敗しました:`, error);
    throw error;
  }
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
}; 