export class SendMessageCommand {
  public readonly message: string;
  public readonly userId: string;

  constructor({ message, userId }: { message: string; userId: string }) {
    this.message = message;
    this.userId = userId;
  }
}
