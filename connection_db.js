const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const { DATABASE_URL, DATABASE_NAME } = process.env;

let client;

async function connectDB() {
  if (client && client.isConnected()) {
    return client;
  }

  try {
    client = await MongoClient.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conexión establecida con MongoDB');
    return client;
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    throw error;
  }
}

function getClient() {
  if (!client || !client.topology.isConnected()) {
    throw new Error('No hay conexión con MongoDB');
  }

  return client;
}

function getDB() {
  return getClient().db(DATABASE_NAME);
}

module.exports = { connectDB, getDB };
