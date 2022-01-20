import React from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { getProducts,getBraintreeClientToken,processpayment,createorder} from "./apiCore";
import { useEffect, useState } from "react";
import Card from "./Card";
import { isAuthenticated } from "../auth";
//import "braintree-web";
import DropIn from 'braintree-web-drop-in-react';
import { emptyCart } from "./cartHelpers";

const Checkout=({products})=>{

    const [data,setData]=useState({
        loading:false,
        success:false,
        clientToken:null,
        error:'',
        instance:{},
        address:''
    });

    const userId=isAuthenticated() && isAuthenticated().user._id;
    const token=isAuthenticated() && isAuthenticated().token;

    const getToken=(userId,token)=>{
        getBraintreeClientToken(userId,token).then(data=>{
            if(data.error){
                setData({...data,error:data.error});
            }else{
                setData({clientToken:data.clientToken}); // done like this, not with ...data, as due to data variable name conflict, 
            }                                            // the func returns data. so we only update the clienttoken 

        });
    }

    useEffect(()=>{
        getToken(userId,token);

    },[]);

    const handleAddress = event => {
        setData({ ...data, address: event.target.value });
    };

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {   // see javascript what reduce does
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout=()=>{
        return(
            isAuthenticated()?
                (<div>
                    {showDropIn()}
                </div>)
                :
                (<Link to="/signin">
                    <button className="btn btn-primary">
                            SignIn to Checkout
                        </button>
                    </Link>)
            
        );
    };
    
    let deliveryaddress=data.address;

    const buy=()=>{
        setData({ loading: true });
        // here sending nonce to server
        // nonce = data.instance.requestPaymentMethod()
        // nonce contains info like card type, card number ...

        let nonce;
        let getNonce=data.instance
        .requestPaymentMethod()
        .then(data=>{
            //console.log(data);
            nonce=data.nonce;
            
            const paymentData={
                paymentMethodNonce:nonce,
                amount:getTotal(products)
            }

            processpayment(userId,token,paymentData)
            .then(response=>{
                console.log(response);

                const createorderData={
                    products:products,
                    transaction_id:response.transaction.id,
                    amount:response.transaction.amount,
                    address:deliveryaddress
                }

                createorder(userId,token,createorderData);

                setData({...data,success:true});
                emptyCart(()=>{
                    console.log('Payment success and empty cart');
                    setData({loading:false,success:true});
                    
                });

            })
            .catch(error=>console.log(error))
        })
        .catch(error=>{
            console.log("error: ",error);
            setData({...data,error:error.message});
        });


    };

    const refresh=()=>{
        window.location.reload(false);
        
    }

    // onBlur will run when we do anychange within that div
    const showDropIn=()=>(
        <div onBlur={()=>setData({...data,error:""})}>
            {data.clientToken !==null && products.length>0?(
                <div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>
                    <DropIn 
                        options={{
                            authorization: data.clientToken,
                            // paypal: {
                            //     flow:"vault"
                            // },
                            googlePay: {
                                googlePayVersion: 2,
                                transactionInfo: {
                                  totalPriceStatus: 'FINAL',
                                  totalPrice: '123.45',
                                  currencyCode: 'USD'
                                },
                                allowedPaymentMethods: [{
                                  type: 'CARD',
                                  parameters: {
                                    // We recommend collecting and passing billing address information with all Google Pay transactions as a best practice.
                                    billingAddressRequired: true,
                                    billingAddressParameters: {
                                      format: 'FULL'
                                    }
                                  }
                                }]
                              }
                        }} 
                        onInstance={instance=>(data.instance=instance)}/>
                    <button onClick={buy} className="btn btn-success btn-block">Pay</button>
                </div>
            ):null} 
        </div>
    );

    const showError=error=>(
        <div className="alert alert-danger" style={{display:error?'':'none'}}>{error}</div>
    );

    const showSuccess=success=>(
        <div className="alert alert-info" style={{display:success?'':'none'}}>Thanks! Your Payment was successful</div>
    );

    const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;

    return <div>
        <h2>
        Total: ₹{getTotal()}    
        </h2>
        {showLoading(data.loading)}
        {showSuccess(data.success)}
        {showError(data.error)}
        {showCheckout()}
       
    </div>

}



export default Checkout;