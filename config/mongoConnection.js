import { MongoClient } from 'mongodb';

const mongoConfig = {
  serverUrl: 'mongodb://127.0.0.1:27017/',
  database: 'BikeSafeNYC'
};

let _connection = undefined;
let _db = undefined;

export const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};

export const closeConnection = async () => {
  if (_connection) {
    await _connection.close();
  }
};