const amqp = require('amqplib');
import dotenv from 'dotenv';

dotenv.config();

class RabbitMQProvider {
    constructor(uri) {
        this.uri = uri;
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(this.uri);
            this.channel = await this.connection.createChannel();
            console.log('Conexão com RabbitMQ estabelecida com sucesso');
        } catch (error) {
            console.error('Erro ao conectar ao RabbitMQ:', error);
            throw error;
        }
    }

    async sendToQueue(queue, message) {
        if (!this.channel) {
            throw new Error('O canal não foi inicializado. Chame o método connect() primeiro.');
        }

        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Mensagem enviada para a fila "${queue}": ${message}`);
    }

    async disconnect() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('Conexão com RabbitMQ encerrada');
        } catch (error) {
            console.error('Erro ao encerrar a conexão com RabbitMQ:', error);
        }
    }
}

export default new RabbitMQProvider(this.uri);