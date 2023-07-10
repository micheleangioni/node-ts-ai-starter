import IEntity from '../domain/IEntity';
import EventPublisher from './eventPublisher';

export abstract class AbstractApplicationService {
  protected constructor(private readonly eventPublisher?: EventPublisher) {}

  /**
   * If this.eventPublisher is provided, send the events of input Entity for input source.
   *
   * @param {IEntity} entity
   * @param {string} source
   * @return Promise<true>
   */
  protected async sendApplicationEvents(source: string, entity: IEntity): Promise<true> {
    if (this.eventPublisher) {
      await this.eventPublisher.publish(source, entity.releaseDomainEvents());
    }

    return true;
  }
}
