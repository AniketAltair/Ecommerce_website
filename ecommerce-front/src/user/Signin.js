import React,{useState}  from "react";
import Layout from "../core/Layout";
import { Link,Redirect } from "react-router-dom";
import { signin,authenticate,isAuthenticated} from "../auth";


const Signin=()=>{
    // can also do const[name,setname]=usestate(), similiarly for email, password, but inefficient. 
    const[values,setValues]=useState({
        email:"", // latter change to blank
        password:"",     // latter change to blank
        error:'',
        loading:false,
        redirecttoReferrer:false,
    });

    const {email,password,error,redirecttoReferrer,loading}=values;
    const {user}=isAuthenticated();

    // below method done like this because, if not will have to make method for each name,email,password...
    const handlechange=name=>event=>{
        setValues({...values,error:false,[name]:event.target.value}); // [name] refers to any field passed like name, password,email...
    };   
    
    

    const clickSubmit=(event)=>{

        event.preventDefault(); // done so that the browser does not reload when button is clicked
        setValues({...values,error:false,loading:true});
        signin({email:email,password:password})
        .then(data=>{
            if(data.error){
                setValues({...values,error:data.error,loading:false})
            }else{
                authenticate(
                    data,
                    ()=>{
                        setValues({
                            ...values,
                            
                            redirecttoReferrer:true
                        });
                    }
                    )
            }
        });

    };

    const SignUpform=()=>(  
        <form>
            
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handlechange('email')} type="email" className="form-control"
                value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handlechange('password')} type="password" className="form-control"
                value={password}
                />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
            
            
        </form>
    )
    // display controls if a component should be visible or not
    const showerror=()=>(
        
        <div className="alert alert-danger" style={{display:error?"":"none"}}> 
            {error}
        </div>
    );

    const showLoading=()=>
        loading && (
        <div className="alert alert-info">
            Loading...
        </div>
        );

    const redirectUser=()=>{
        if(redirecttoReferrer){
            if(user && user.role===1){
                return <Redirect to="/admin/dashboard"/>
            }else{
                return <Redirect to="/user/dashboard"/>
            }
        }
        if(isAuthenticated()){
            return <Redirect to="/" />
        }
    }
        



    return(
    <Layout title="SignInPage" description="SignInNode React Ecommerce App" className="container col-md-8 offset-md-2">
        {showLoading()}
        {showerror()}
        {SignUpform()}
        {redirectUser()}
        
    </Layout>

    );
    
    
}



export default Signin;