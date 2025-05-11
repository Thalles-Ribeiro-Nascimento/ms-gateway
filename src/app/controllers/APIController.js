import dotenv from 'dotenv';
import RabbitMQProvider from '../provider/rabbitmq/rabbitmq.provider.js'

dotenv.config();

/**
 * Classe responsável por receber e processar as requisições HTTP
 * @author Thalles Nascimento
 * @class
 */
class AlunoController{

  /**
   * Construtor para injeção da instância da classe AlunoRepository
   * @constructor
   */
    constructor(){
      this.rabbitMQ = new RabbitMQProvider(process.env.RABBITMQ_URI)
      this.rabbitMQ.connect()
    }

    /**
     * Método para inserir um registro no Banco de Dados
     * @param {JSON | Number | String | List} req É a Requisão do Cliente: Body/Headers
     * @param {JSON | Number | String | List} res É a Resposta do Servidor
     */
    async store(req, res){
        const queue = req.body.queue;
        const message = req.body.message;

        if (!queue || !message) {
            return res.status(400).json({ error: 'A fila e a mensagem são obrigatórias' });
        }
        
        try {
            await this.rabbitMQ.sendToQueue(queue, message);
            res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso' });
        } catch (error) {
            console.error('Erro ao enviar mensagem para a fila:', error);
            res.status(500).json({ error: 'Erro ao enviar mensagem para a fila' });
        }     
        
    }


}

/**
 * Padrão Singleton -> Designer Patterns
 *      Foi criada e exportada apenas uma instância da classe AlunoController
 *  */ 
export default new AlunoController()