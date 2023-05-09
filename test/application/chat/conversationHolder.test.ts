import ChatConversation from '../../../src/application/chat/chatConversation';
import conversationHolder from '../../../src/application/chat/conversationHolder';

describe('ConversationHolder', () => {
  let holder = conversationHolder();
  const conversation1Id = 'conversation1';
  let conversation1: ChatConversation;
  const conversation2Id = 'conversation2';
  let conversation2: ChatConversation;

  beforeEach(() => {
    process.env.OPENAI_ORGANIZATION_ID =  'organizationId';
    process.env.OPENAI_API_KEY = 'key';
    conversation1 = new ChatConversation();
    conversation2 = new ChatConversation();;
  });

  beforeEach(() => {
    holder = conversationHolder();
    holder.removeConversation(conversation1Id);
    holder.removeConversation(conversation2Id);
  });

  test('addConversation() should add a conversation to the holder', () => {
    holder.addConversation(conversation1Id, conversation1);
    expect(holder.retrieveConversation(conversation1Id)).toEqual(conversation1);
  });

  test('removeConversation() should remove a conversation from the holder', () => {
    holder.addConversation(conversation1Id, conversation1);
    holder.addConversation(conversation2Id, conversation2);
    holder.removeConversation(conversation1Id);
    expect(holder.retrieveConversation(conversation1Id)).toBeUndefined();
    expect(holder.retrieveConversation(conversation2Id)).toEqual(conversation2);
  });

  test('retrieveConversation() should retrieve a conversation from the holder', () => {
    holder.addConversation(conversation1Id, conversation1);
    expect(holder.retrieveConversation(conversation1Id)).toEqual(conversation1);
    expect(holder.retrieveConversation(conversation2Id)).toBeUndefined();
  });
});
