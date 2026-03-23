import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found',async()=>{
    //only use valid mongoose id because the format of mongoose id is not just random string
    const id=new mongoose.Types.ObjectId().toHexString();
     await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});
it('returns the ticket if the ticket is found',async()=>{
    const title='my back';
    const price=200;

    const response=await request(app)
    .post('/api/tickets')
    .set('Cookie',await global.signin())
    .send({
        title,
        price
    })
    .expect(201);

    const ticketResponse=await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});