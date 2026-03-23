import { Publisher,OrderCancelledEvent,Subjects } from "@bikalticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject=Subjects.OrderCancelled;
};
