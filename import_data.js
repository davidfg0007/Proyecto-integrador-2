const fs = require('fs');
const { connectDB, getDB } = require('./connection_db');

async function importData() {
  try {
    // Leer los datos desde el archivo data.json
    const rawData = fs.readFileSync('./data.json');
    const mueblesData = JSON.parse(rawData);

    // Conectar con la base de datos
    const client = await connectDB();
    const db = getDB();
    const mueblesCollection = db.collection('muebles');

    // Insertar los datos en la colección "muebles"
    const result = await mueblesCollection.insertMany(mueblesData);

    console.log('Datos importados correctamente:', result.insertedCount, 'muebles');
  } catch (error) {
    console.error('Error al importar los datos:', error);
  } finally {
    // Cerrar la conexión con la base de datos
    const client = await connectDB();
    
  }
}

importData();
