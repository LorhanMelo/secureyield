import { app, initialize } from './app';
import { config } from './config/config';

const start = async () => {
  try {
    // Inicializa a aplicação
    const server = await initialize();
    
    // Inicia o servidor
    await server.listen({ 
      port: config.port, 
      host: config.host 
    });
    
    console.log(`Servidor rodando em http://${config.host}:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
