import ChatConversation from './chatConversation';

class ConversationHolder {
  private readonly conversations: Record<string, ChatConversation> = {};

  public addConversation(uniqueIdentifier: string, conversation: ChatConversation) {
    this.conversations[uniqueIdentifier] = conversation;
  }

  public removeConversation(uniqueIdentifier: string) {
    delete this.conversations[uniqueIdentifier];
  }

  public retrieveConversation(uniqueIdentifier: string): ChatConversation | undefined {
    return this.conversations[uniqueIdentifier];
  }
}

let conversationHolder: ConversationHolder | undefined;

/**
 * This simple Conversation Holder keeps track of conversation in memory.
 * Simple Singleton implementation.
 */
export default () => {
  if (!conversationHolder) {
    conversationHolder = new ConversationHolder();
  }

  return conversationHolder;
};
