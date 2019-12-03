import Cloudevent from 'cloudevents-sdk/v1';
import {IDomainEvent} from '../domain/IDomainEvent';

export type ApplicationErrorData = {
  code?: string,
  message: string,
  status?: number,
};

export enum ErrorCodes {
  FORBIDDEN = 'forbidden',
  INTERNAL_ERROR = 'internal-error',
  INVALID_DATA = 'invalid-data',
  NOT_FOUND = 'not-found',
  UNAUTHORIZED = 'unauthorized',
}

export type GroupedByAggregateEvents = {
  [aggregate: string]: IDomainEvent[],
};

export type GroupedByAggregateCloudevents = {
  [aggregate: string]: Cloudevent[],
};
