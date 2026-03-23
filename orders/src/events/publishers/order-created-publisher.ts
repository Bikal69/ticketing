import { Publisher,OrderCreatedEvent,Subjects } from "@bikalticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject=Subjects.OrderCreated;
};
