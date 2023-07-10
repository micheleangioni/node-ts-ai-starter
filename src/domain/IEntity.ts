import {IDomainEvent} from './IDomainEvent';

export default interface IEntity {
  readonly id: number | string;
  releaseDomainEvents(): IDomainEvent[];
}
