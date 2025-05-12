import dotenv from 'dotenv';
import RabbitMQProvider from '../provider/rabbitmq/rabbitmq.provider.js';

dotenv.config();

/**
 * Classe responsável por receber e processar as requisições HTTP
 */
class APIController {
  constructor() {
    // Instancia e conecta ao RabbitMQ
    this.rabbit = new RabbitMQProvider(process.env.RABBITMQ_URI);
    this.rabbit.connect().catch(error => {
      console.error('Falha ao conectar ao RabbitMQ no controller:', error);
    });

    // Garante que os métodos mantenham o 'this'
    this.store = this.store.bind(this);
  }

  /**
   * Insere uma mensagem na fila RabbitMQ
   * @param {Object} req - Requisição HTTP
   * @param {Object} res - Resposta HTTP
   */
  async store(req, res) {
    const payload = req.body;
    const queue = process.env.RABBITMQ_QUEUE;

    // Verifica se o body foi fornecido
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'O corpo da requisição é obrigatório' });
    }

    // Converte objeto em string para envio
    const message = JSON.stringify(payload);

    try {
      await this.rabbit.sendToQueue(queue, message);
      return res.status(200).json({ success: true});
    } catch (error) {
      console.error('Erro ao enviar mensagem para a fila:', error);
      return res.status(500).json({ error: 'Erro ao enviar mensagem para a fila' });
    }
  }

  /**
   * Testa rota GET
   */
//   async test(req, res) {
//     return res.status(200).json({ success: true, message: 'Rota GET funcionando corretamente' });
//   }
}

// Exporta instância única com métodos já vinculados
export default new APIController();
