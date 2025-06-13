// src/utils/sql.js
const sql = require('mssql');

async function consultarSQL(query, configSql) {
  const config = {
    user: configSql.user,
    password: configSql.password,
    server: configSql.server,
    database: configSql.database,
    port: configSql.port || 1435, 
    options: {
      encrypt: false,
      trustServerCertificate: true
    }
  };

  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error('❌ Error ejecutando SQL:', err.message);
    return null;
  }
}

module.exports = { consultarSQL };
