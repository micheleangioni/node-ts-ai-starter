export default interface IHandler {
  handle(queryOrCommand: Record<string, any>): any;
}
