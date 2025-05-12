import Router from '../src/routes/routes.js';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Instância da classe @Router
 */
const routers = Router;
routers.listen(process.env.SERVER_HOST, process.env.SERVER_PORT);

/**
 * Método para acessar a rota que insere registros no Banco de Dados
 */
routers.insert();

//Expor a instância da classe Router
export default routers;