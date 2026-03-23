import {Publisher,Subjects,PaymentCreatedEvent} from '@bikalticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject=Subjects.PaymentCreated;
}