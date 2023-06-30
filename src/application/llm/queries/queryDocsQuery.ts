export class QueryDocsQuery {
  public readonly query: string;

  constructor({ query }: { query: string }) {
    this.query = query;
  }
}
