export abstract class BaseEvent {
  constructor(private aggregate: string) {}

  public getEventAggregate(): string {
    return this.aggregate;
  }
}
