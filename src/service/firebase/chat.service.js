import { BaseRepository } from '../repository/base.repository';

class ChatService extends BaseRepository {
  constructor() {
    super('messages');
  }
}

export const chatService = new ChatService();
