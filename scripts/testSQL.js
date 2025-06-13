const { consultarSQL } = require('../src/utils/sql');

(async () => {
  const config = {
    user: 'sa',
    password: '1234',
    server: 'localhost',
    database: 'VentaRepuestosTest',
    port: 1435
  };

  const query = 'SELECT TOP 5 * FROM Productos';

  const resultado = await consultarSQL(query, config);

  console.log('📦 Resultado:', resultado);
})();
