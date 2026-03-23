import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import {Ticket} from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '@bikalticketing/common';

it('returns an error if the ticket does not exist',async()=>{
    const ticketId=new mongoose.Types.ObjectId();
    const response=await request(app)
    .post('/api/orders')
    .set('Cookie',await global.signin())
    .send({
        ticketId
    })
    .expect(404);
});

it('returns an error if the ticket is already reserved',async()=>{
    //create a ticket and save it to database
    const ticket= Ticket.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:20
    });
    await ticket.save();
    //create an order with this ticket and save it to database
    const order=Order.build({
        ticket,
        userId:'lsdafsf',
        status:OrderStatus.Created,
        expiresAt:new Date()
    });
    await order.save();
    //try to create replicate a order request with same ticket and expect an error
    await request(app)
    .post('/api/orders')
    .set('Cookie',await global.signin())
    .send({ticketId:ticket.id})
    .expect(400);
});
it('reserves a ticket',async()=>{
   const ticket=Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    title:'concert',
    price:20
   });
   await ticket.save();
   
   await request(app)
   .post('/api/orders')
   .set('Cookie',await global.signin())
   .send({ticketId:ticket.id})
   .expect(201);
});

it('emits an order created event',async()=>{
    const title='my body';
    const price=20;

    const ticket=Ticket.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        title,
        price
    });
    await ticket.save();
    const order=await request(app)
    .post('/api/orders')
    .set('Cookie',await global.signin())
    .send({ticketId:ticket.id})
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})