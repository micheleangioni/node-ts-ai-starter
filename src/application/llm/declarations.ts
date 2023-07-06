export type ChatOptions = {
  context?: string;
  maxTokens?: number;
  temperature?: number;
  template?: string;
  verbose?: boolean;
};

export type QueryDocsOptions = {
  maxTokens?: number;
  temperature?: number;
  verbose?: boolean;
};

export type SendMessageInput = {
  message: string;
};
