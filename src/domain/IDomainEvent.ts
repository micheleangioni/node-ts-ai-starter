export interface IDomainEvent {
  getEventAggregate(): string;
  getEventName(): string;
  getEventData(): Record<string, unknown>;
}
