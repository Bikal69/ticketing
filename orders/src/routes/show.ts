import express,{Request,Response} from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth,validateRequest } from '@bikalticketing/common';
import {Order} from '../models/order';
import {body,param} from 'express-validator';
import mongoose from 'mongoose';

const router=express.Router();

router.get('/api/orders/:orderId',[
    param('orderId')
    .custom((inputParam:string)=>mongoose.Types.ObjectId.isValid(inputParam))
    .withMessage('orderId must be valid')
],validateRequest,requireAuth,async(req:Request,res:Response)=>{
    console.log('show request')
    const order=await Order.findById(req.params.orderId).populate('ticket');
    if(!order){
        throw new NotFoundError();
    };
    if(order.userId!==req.currentUser?.id){
        throw new NotAuthorizedError()
    };
    res.send(order);
});
export {router as showOrderRouter};