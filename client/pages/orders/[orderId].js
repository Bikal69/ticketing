import { useEffect,useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow=({order,currentUser})=>{
    const [timeLeft,setTimeLeft]=useState(0);
    const {doRequest,errors}=useRequest({
        url:'/api/payments',
        method:'post',
        body:{
            orderId:order.id,
        },
        onSuccess:(payment)=>Router.push('/orders'),
    });
    useEffect(()=>{
        const findTimeLeft=()=>{
            const msLeft=new Date(order.expiresAt)-new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };
        findTimeLeft();
        const timerId=setInterval(findTimeLeft,1000);

        return ()=>{
            clearInterval(timerId);
        };
    },[order]);

    if(timeLeft<0){
        return <div>Order Expired!</div>
    }

    return <div>
        Time left to pay: {timeLeft} seconds
        <StripeCheckout
        token={({id})=>doRequest({token:id})
        }
        stripeKey="pk_test_51TCZ8L9rqIohgVESbRtzzxgmhZ1w78dSaCpg3JJ9U96DGjFEU8niuwocTasVvqm8xfkCYl8EXoscKGSn8oQvxpc700odaG8jGL"
        amount={order.price*100}
        email={currentUser.email}
        />
        </div>
};

OrderShow.getInitialProps=async(useContext,client)=>{
    const {orderId}=useContext.query;
    const {data}=await client.get(`/api/orders/${orderId}`);

    return {order: data};
}
export default OrderShow;