import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist',async()=>{
    const postId=new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${postId}`)
    .send({
        title:'asdfasd',
        price:20
    })
    expect(404);
});
it('returns a 401 if the user is not authenticated',async()=>{
    const id=new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title:'asdfasd',
        price:20
    })
    .expect(401);
});
it('returns a 401 if the user doesnot own the ticket',async()=>{
    const response=await request(app)
    .post('/api/tickets')
    .set('Cookie',await global.signin())
    .send({
        title:'asdfasd',
        price:20
    })
    .expect(201);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',await global.signin())
    .send({
        title:'adfadfafdsf',
        price:1000
    })
    .expect(401);
});
it('returns a 400 if the user provides invalid  title or price',async()=>{
    const response=await request(app)
    .post('/api/tickets')
    .set('Cookie',await global.signin())
    .send({
        title:'sdfasdf',
        price:20
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',await global.signin())
    .send({
        title:'',
        price:20
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',await global.signin())
    .send({
        title:'sdfdsfdsf',
        price:-10
    })
    .expect(400);

});
it('updates the ticket provided valid inputs',async()=>{
    const authorCookie= await global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',authorCookie)
    .send({
        title:'my body',
        price:100
    })
    .expect(201);
    const newTitle='updated title';
    const newPrice=300;
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',authorCookie)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(200);

    const ticketResponse=await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
});

it('publishes an event',async()=>{
    const authorCookie= await global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',authorCookie)
    .send({
        title:'my body',
        price:100
    })
    .expect(201);
    const newTitle='updated title';
    const newPrice=300;
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',authorCookie)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved',async()=>{
    const authorCookie= await global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',authorCookie)
    .send({
        title:'my body',
        price:100
    })
    .expect(201);

    const ticket=await Ticket.findById(response.body.id);
    ticket!.set({orderId:new mongoose.Types.ObjectId().toHexString()});
    await ticket!.save();
    
    const newTitle='updated title';
    const newPrice=300;
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',authorCookie)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(400);
});