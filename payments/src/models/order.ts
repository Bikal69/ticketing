import mongoose from 'mongoose';
import {OrderStatus} from '@bikalticketing/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs{
    id:string;
    status:OrderStatus;
    version:number;
    userId:string;
    price:number;
};
interface OrderDoc extends mongoose.Document{
    status:OrderStatus;
    version:number;
    userId:string;
    price:number;
};
interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs:OrderAttrs):OrderDoc;
};
const orderSchema=new mongoose.Schema({
    status:{
        type:String,
        required:true,
        enum:Object.values(OrderStatus),
        default:OrderStatus.Created,
    },
    userId:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
},{
    toJSON:{
        transform(doc,ret){
            const {__v,_id,...rest}=ret;
            return {
                ...rest,
                id:_id
            };
        }
    }
});

orderSchema.set('versionKey','version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build=({id,...rest}:OrderAttrs)=>{
    return new Order({
        _id:id,
        ...rest
    });
};

const Order=mongoose.model<OrderDoc,OrderModel>('Order',orderSchema);

export {Order};