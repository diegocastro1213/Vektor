require('dotenv').config();
const sql = require('mssql/msnodesqlv8');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const Embedding = require('../src/models/embedding');

// Conexión SQL usando msnodesqlv8 con instancia nombrada
const sqlConfig = {
  connectionString: `Driver={ODBC Driver 18 for SQL Server};Server=localhost\\MSSQLSERVER01;Database=${process.env.DB_NAME};UID=${process.env.DB_USER};PWD=${process.env.DB_PASSWORD};Encrypt=yes;TrustServerCertificate=yes;`,
  driver: 'msnodesqlv8'
};

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ Conectado a MongoDB");
}).catch(err => console.error("❌ Mongo error:", err.message));

// OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function vectorizarTablaSQL() {
  try {
    await sql.connect(sqlConfig);
    console.log("✅ Conectado a SQL Server");

    const resultado = await sql.query`
      SELECT 
        Codigo AS id,
        Nombre,
        Marca,
        ModeloCompatible,
        Categoria,
        Descripcion,
        PrecioUnitario,
        Descuento,
        Existencias,
        UbicacionAlmacen
      FROM [VentaRepuestosTest].[dbo].[Productos]
    `;

    for (const fila of resultado.recordset) {
      const texto = `${fila.Nombre} - ${fila.Marca} - ${fila.ModeloCompatible} - ${fila.Categoria} - ${fila.Descripcion}`;
      console.log(`🧠 Vectorizando: ${texto}`);

      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texto
      });

      await Embedding.create({
        texto,
        vector: embedding.data[0].embedding,
        metadata: {
          codigo: fila.id,
          nombre: fila.Nombre,
          marca: fila.Marca,
          categoria: fila.Categoria,
          modelo: fila.ModeloCompatible,
          precio: fila.PrecioUnitario,
          existencias: fila.Existencias,
          ubicacion: fila.UbicacionAlmacen
        }
      });

      console.log('✅ Guardado en MongoDB');
    }

    console.log('🚀 Proceso completado.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

vectorizarTablaSQL();
