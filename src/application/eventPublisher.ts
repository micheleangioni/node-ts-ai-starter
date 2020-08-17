import { CloudEventFactory } from '@micheleangioni/node-messagebrokers';
import { IBrokerInterface } from '@micheleangioni/node-messagebrokers';
import { CloudEvent } from 'cloudevents';
import { IDomainEvent } from '../domain/IDomainEvent';
import ILogger from '../infra/logger/ILogger';
import { GroupedByAggregateCloudevents, GroupedByAggregateEvents } from './declarations';

export default class EventPublisher {
  constructor(private messageBroker: IBrokerInterface, private logger: ILogger) {}

  /**
   * Take a list of Domain Events, convert them to the CloudEvents format and then publish them.
   * If provided, a partition key will be used for all events.
   *
   * @param {string} source
   * @param {IDomainEvent[} events
   * @param {string|undefined} partitionKey
   */
  public async publish(source: string, events: IDomainEvent[], partitionKey?: string) {
    // Group events by aggregate

    const groupedEvents = events.reduce((acc: GroupedByAggregateEvents, event) => {
      if (!acc[event.getEventAggregate()]) {
        acc[event.getEventAggregate()] = [event];
      } else  {
        acc[event.getEventAggregate()].push(event);
      }

      return acc;
    }, {});

    // Convert events to CloudEvents format

    const groupedCloudevents: GroupedByAggregateCloudevents = Object.keys(groupedEvents)
      .reduce((acc: GroupedByAggregateCloudevents, aggregate) => {
        acc[aggregate] = groupedEvents[aggregate].map(
          (domainEvent) => this.convertDomainEventToCloudEvent(source, domainEvent),
        );

        return acc;
      }, {});

    // Publish the events

    const promises = Object.keys(groupedCloudevents).map((aggregate: string) => {
      return this.messageBroker.sendMessage(aggregate, groupedCloudevents[aggregate], { partitionKey } );
    });

    await Promise.all(promises);

    if (events.length === 1) {
      this.logger.info({
        data: events[0].getEventData(),
        message: `Successfully published ${events[0].getEventAggregate()} ${events[0].getEventName()} event`,
        type: 'kafka',
      });
    } else {
      Object.keys(groupedEvents).forEach((aggregate) => {
        this.logger.info({
          data: groupedEvents[aggregate].map((cloudevent) => cloudevent.getEventData()),
          message: `Successfully published ${groupedEvents[aggregate].length} ${aggregate} events`,
          type: 'kafka',
        });
      });
    }
  }

  private convertDomainEventToCloudEvent(source: string, event: IDomainEvent): CloudEvent {
    return CloudEventFactory.createV1(event.getEventAggregate(), event.getEventName(), source, event.getEventData());
  }
}
