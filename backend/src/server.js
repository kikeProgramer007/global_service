require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('--------------------------------------------------');
    console.log('Conexión exitosa a PostgreSQL usando Prisma Client.');

    const server = app.listen(PORT, () => {
      console.log(`Servidor CMS iniciado en el puerto ${PORT}`);
      console.log(`URL local: ${process.env.APP_URL || 'http://localhost:' + PORT}`);
      console.log('--------------------------------------------------');
    });

    // Graceful Shutdown
    const cleanShutdown = async () => {
      console.log('Cerrando servidor y desconectando base de datos...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Conexiones cerradas de forma segura.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', cleanShutdown);
    process.on('SIGINT', cleanShutdown);

  } catch (err) {
    console.error('Error fatal al iniciar el servidor:', err);
    process.exit(1);
  }
}

startServer();
