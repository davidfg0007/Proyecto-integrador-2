const express = require('express');
const dotenv = require('dotenv');
const { connectDB, getDB } = require('../connection_db');

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3005;

app.use(express.json());

async function startServer() {
  try {
    // Conectarse a la base de datos antes de iniciar el servidor
    await connectDB();

    // Endpoint para obtener los registros de todos los muebles (sin ordenar)
    app.get('/muebles', async (req, res) => {
      try {
        const db = getDB();
        const muebles = await db.collection('muebles').find().toArray();
        res.json(muebles);
        console.log('payload: muebles');
      } catch (error) {
        console.error('Error al obtener los muebles:', error);
        res.status(500).json({ error: 'Se ha generado un error en el servidor' });
      }
    });

    // Endpoint para obtener los registros de los muebles filtrados y ordenados por una categoría
    app.get('/muebles/categoria/:categoria', async (req, res) => {
      const { categoria } = req.params;
      try {
        const db = getDB();
        const muebles = await db.collection('muebles').find({ categoria }).toArray();
        res.json(muebles);
      } catch (error) {
        console.error('Error al obtener los muebles por categoría:', error);
        res.status(500).json({ error: 'Error al obtener los muebles por categoría' });
      }
    });

    // Endpoint para obtener los registros de los muebles por precio mayor o igual que un valor y ordenados por el precio de forma ascendente
    app.get('/muebles/precio-mayor/:valor', async (req, res) => {
      const { valor } = req.params;
      try {
        const db = getDB();
        const muebles = await db.collection('muebles').find({ precio: { $gte: parseFloat(valor) } }).sort({ precio: 1 }).toArray();
        res.json(muebles);
      } catch (error) {
        console.error('Error al obtener los muebles por precio mayor o igual:', error);
        res.status(500).json({ error: 'Error al obtener los muebles por precio mayor o igual' });
      }
    });

    // Endpoint para obtener los registros de los muebles por precio menor o igual que un valor y ordenados por el precio de forma descendente
    app.get('/muebles/precio-menor/:valor', async (req, res) => {
      const { valor } = req.params;
      try {
        const db = getDB();
        const muebles = await db.collection('muebles').find({ precio: { $lte: parseFloat(valor) } }).sort({ precio: -1 }).toArray();
        res.json(muebles);
      } catch (error) {
        console.error('Error al obtener los muebles por precio menor o igual:', error);
        res.status(500).json({ error: 'Error al obtener los muebles por precio menor o igual' });
      }
    });

    // Endpoint para obtener el registro de un mueble por su código
    app.get('/muebles/:codigo', async (req, res) => {
      const { codigo } = req.params;
      try {
        const db = getDB();
        const mueble = await db.collection('muebles').findOne({ codigo: parseInt(codigo) });
        if (mueble) {
          res.json(mueble);
          console.log('payload: muebles');
        } else {
          res.status(404).json({ error: 'El código no corresponde a un mueble registrado' });
        }
      } catch (error) {
        console.error('Error al obtener el mueble por código:', error);
        res.status(500).json({ error: 'Se ha generado un error en el servidor' });
      }
    });

    // Endpoint para crear un nuevo registro de un mueble
    app.post('/muebles', async (req, res) => {
      const nuevoMueble = req.body;
      try {
        const db = getDB();
        const resultado = await db.collection('muebles').insertOne(nuevoMueble);
        res.json(resultado.ops[0]);
        console.log('Registro creado, payload: mueble');
      } catch (error) {
        console.error('Error al crear el nuevo mueble:', error);
        res.status(500).json({ error: 'Se ha generado un error en el servidor' });
      }
    });

    // Endpoint para actualizar el registro de un mueble por su código
    app.put('/muebles/:codigo', async (req, res) => {
      const { codigo } = req.params;
      const actualizacionMueble = req.body;
      try {
        const db = getDB();
        const resultado = await db.collection('muebles').findOneAndUpdate(
          { codigo: parseInt(codigo) },
          { $set: actualizacionMueble },
          { returnOriginal: false },
          console.log('Registro actualizado, payload: mueble')
        );
        if (resultado.value) {
          res.json(resultado.value);
        } else {
          res.status(404).json({ error: 'El código no corresponde a un mueble registrado / Faltan datos relevantes' });
        }
      } catch (error) {
        console.error('Error al actualizar el mueble por código:', error);
        res.status(500).json({ error: 'Se ha generado un error en el servidor' });
      }
    });

    // Endpoint para eliminar el registro de un mueble por su código
    app.delete('/muebles/:codigo', async (req, res) => {
      const { codigo } = req.params;
      try {
        const db = getDB();
        const resultado = await db.collection('muebles').findOneAndDelete({ codigo: parseInt(codigo) });
        if (resultado.value) {
          res.json(resultado.value);
          console.log('Registro eliminado');
        } else {
          res.status(404).json({ error: 'El código no corresponde a un mueble registrado' });
        }
      } catch (error) {
        console.error('Error al eliminar el mueble por código:', error);
        res.status(500).json({ error: 'Se ha generado un error en el servidor' });
      }
    });

    // Endpoint para manejar rutas inexistentes
    app.use((req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor en ejecución en http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();

