import mongoose from 'mongoose';

interface PaymentAttrs{
    orderId:string;
    stripeId:string;
};

interface PaymentDoc extends mongoose.Document{
    orderId:string;
    stripeId:string;
};

interface PaymentModel extends mongoose.Model<PaymentDoc>{
    build(attrs:PaymentAttrs):PaymentDoc
};

const paymentSchema=new mongoose.Schema({
    orderId:{
        type:String,
        required:true
    },
    stripeId:{
        type:String,
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
paymentSchema.statics.build=(attrs:PaymentAttrs)=>{
    return new Payment(attrs);
};
const Payment=mongoose.model<PaymentDoc,PaymentModel>('payment',paymentSchema);

export {Payment};