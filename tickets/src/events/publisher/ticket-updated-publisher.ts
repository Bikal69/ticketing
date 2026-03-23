import {Publisher,Subjects,TicketUpdatedEvent} from '@bikalticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject=Subjects.TicketUpdated;

};