import { Message } from "node-nats-streaming";
import { Listener,TicketCreatedEvent,Subjects } from "@bikalticketing/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject=Subjects.TicketCreated;

    queueGroupName='payments-service-queue-group';
    
    onMessage(data:TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data:',data);
        
        msg.ack();
    }
}