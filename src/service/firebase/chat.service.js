import { BaseRepository } from '../repository/base.repository';

const CHAT_MESSAGES = {};

class ChatService extends BaseRepository {
  constructor() {
    super('messages');
  }
}

export const chatService = new ChatService();
