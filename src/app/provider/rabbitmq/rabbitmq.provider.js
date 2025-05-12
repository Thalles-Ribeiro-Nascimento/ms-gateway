import amqp from 'amqplib';

class RabbitMQProvider {
  /**
   * Cria o provedor com a URI de conexão
   * @param {string} uri - URI de conexão com RabbitMQ
   */
  constructor(uri) {
    this.uri = uri;
    this.connection = null;
    this.channel = null;
    this.connectPromise = null;
  }

  /**
   * Estabelece a conexão e o canal com RabbitMQ apenas uma vez
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = (async () => {
      try {
        this.connection = await amqp.connect(this.uri);
        this.channel = await this.connection.createChannel();
        console.log('Conexão com RabbitMQ estabelecida com sucesso');
      } catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
        this.connectPromise = null;
        throw error;
      }
    })();

    return this.connectPromise;
  }

  /**
   * Envia uma mensagem para a fila especificada, garantindo conexão única
   * @param {string} queue - Nome da fila
   * @param {string} message - Mensagem a ser enviada
   */
  async sendToQueue(queue, message) {
    // Garante conexão e canal
    await this.connect();

    if (!this.channel) {
      throw new Error('Canal não inicializado. Falha na conexão com RabbitMQ.');
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Mensagem enviada`);
    } catch (error) {
      console.error('Erro ao enviar mensagem para a fila:', error);
      throw error;
    }
  }

  /**
   * Fecha o canal e a conexão com RabbitMQ
   */
  async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      this.connectPromise = null;
      console.log('Conexão com RabbitMQ encerrada');
    } catch (error) {
      console.error('Erro ao encerrar a conexão com RabbitMQ:', error);
    }
  }
}

export default RabbitMQProvider;
