export type ChatOptions = {
  context?: string;
  maxTokens?: number;
  temperature?: number;
  template?: string;
};

export type QueryDocsOptions = {
  maxTokens?: number;
  temperature?: number;
};

export type SendMessageInput = {
  message: string;
};
