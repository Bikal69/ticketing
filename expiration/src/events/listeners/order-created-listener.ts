import {Listener,OrderCreatedEvent,Subjects} from '@bikalticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject=Subjects.OrderCreated;
    queueGroupName=queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay=new Date(data.expiresAt).getTime()-new Date().getTime();
        console.log('Waiting this many milliseconds to process the job:',delay);

        await expirationQueue.add({
            orderId:data.id,
        },{
            delay:120*1000
        });
        msg.ack();
        console.log('expiration service did its job');
    }
    
}