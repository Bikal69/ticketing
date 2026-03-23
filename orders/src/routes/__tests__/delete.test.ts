import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@bikalticketing/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled',async()=>{
    //create a ticket with Ticket model
    const ticket=Ticket.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:20
    });
    await ticket.save();
    const user=await global.signin();
    //make a request to create an order
    const {body:order}=await request(app)
    .post('/api/orders')
    .set('Cookie',user)
    .send({ticketId:ticket.id})
    .expect(201);
    //make a request to cancel the order
    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie',user)
    .send()
    .expect(204);
    //expectation to make sure the thing is cancelled
    const updatedOrder=await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie',user)
    .send()
    .expect(200);

    expect(updatedOrder.body.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event',async()=>{
    const title='my body';
    const price=20;
    const user=await global.signin();

    const ticket=Ticket.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        title,
        price
    });
    await ticket.save();
    //create a new order
    const {body:order}=await request(app)
    .post('/api/orders')
    .set('Cookie',user)
    .send({ticketId:ticket.id})
    .expect(201);
    //cancel the order
    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie',user)
    .send()
    .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})