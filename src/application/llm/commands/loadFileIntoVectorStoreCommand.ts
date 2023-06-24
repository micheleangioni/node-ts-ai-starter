export class LoadFileIntoVectorStoreCommand {
  public readonly buffer: Buffer;
  public readonly mimetype: string;
  public readonly fileName: string;

  constructor({ buffer, fileName, mimetype }: { buffer: Buffer; fileName: string; mimetype: string }) {
    this.buffer = buffer;
    this.mimetype = mimetype;
    this.fileName = fileName;
  }
}
