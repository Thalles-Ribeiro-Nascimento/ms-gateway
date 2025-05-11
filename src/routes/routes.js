import express from 'express'
import APIController from '../app/controllers/APIController.js'


/**
 * Classe reponsável por criar as rotas da API
 * @author Thalles Nascimento
 * @description Criar rotas para APIs configuradas na @class APIController
 * 
 * @class
 */
class Router{

    /**
     * Construtor da Classe Router
     * @constructor 
     */
    constructor(){
        /**
         * Instanciando o servidor
         */
        this.router = express()
        this.router.use(express.json())
    }
    /**
     * Método para liberar uma porta no servidor para ser ouvida
     * 
     * @param {String} patch Caminho para o Servidor 
     * @param {Number} port Porta para acesso ao Servidor
     */
    listen(patch, port){
        this.router.listen(port,() =>{
            console.log("Conexão estabelecida")
            console.log(`Endereço: ${patch}:${port}`)
        })

    }

    /**
     * Método para inserção de dados no Banco de Dados
     */
    insert(){
        this.router.post('/send', APIController.store)
    }

}

/**
 * Padrão Singleton -> Designer Patterns
 *      Foi criada e exportada apenas uma instância da classe Router
 * 
 * @Instância
 *  */ 
export default new Router()