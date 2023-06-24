export type ChatOptions = {
  context?: string;
  maxTokens?: number;
  temperature?: number;
  template?: string;
  verbose?: boolean;
};

export type SendMessageInput = {
  message: string;
};
