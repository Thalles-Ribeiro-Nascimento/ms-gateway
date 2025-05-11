import Router from '../src/routes/routes.js'

/**
 * Instância da classe @Router
 */
const routers = Router

/**
 * Método para acessar a rota que insere registros no Banco de Dados
 */
routers.insert()

//Expor a instância da classe Router
export default routers