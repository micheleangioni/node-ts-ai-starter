import ChatConversation from '../chatConversation';
import {SendMessageCommand} from '../commands/sendMessageCommand';
import conversationHolder from '../conversationHolder';
import IHandler from '../../IHandler';

export class SendMessageCommandHandler implements IHandler {
  private readonly conversationHolder;

  constructor() {
    this.conversationHolder = conversationHolder();
  }

  async handle({message, userId}: SendMessageCommand): Promise<string> {
    // TODO Add context and temperature as inputs
    const conversation = this.conversationHolder.retrieveConversation(userId) ?? new ChatConversation({});

    const response = await conversation.sendMessage({message});

    if (!this.conversationHolder.retrieveConversation(userId)) {
      this.conversationHolder.addConversation(userId, conversation);
    }

    return response;
  }
}
