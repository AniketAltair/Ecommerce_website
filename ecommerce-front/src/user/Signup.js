import React,{useState}  from "react";
import Layout from "../core/Layout";
import { Link } from "react-router-dom";
import { signup } from "../auth";


const Signup=()=>{
    // can also do const[name,setname]=usestate(), similiarly for email, password, but inefficient. 
    const[values,setValues]=useState({
        name:'',
        email:'',
        password:'',
        error:'',
        success:false
    });

    const {name,email,password,error,success}=values;

    // below method done like this because, if not will have to make method for each name,email,password...
    const handlechange=name=>event=>{
        setValues({...values,error:false,[name]:event.target.value}); // [name] refers to any field passed like name, password,email...
    };   
    
    

    const clickSubmit=(event)=>{

        event.preventDefault(); // done so that the browser does not reload when button is clicked
        setValues({...values,error:false});
        signup({name:name,email:email,password:password})
        .then(data=>{
            if(data.error){
                setValues({...values,error:data.error,success:false})
            }else{
                setValues({
                    ...values,
                    name:'',
                    email:'',
                    password:'',
                    error:'',
                    success:true
                });
            }
        });

    };

    const SignUpform=()=>(  
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handlechange('name')} type="text" className="form-control"
                value={name}
                />
            </div>
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
            <div>
            <a>Already Have an Account? <Link to="/signin">SignIn</Link>.</a>
            </div>
            
        </form>
    )
    // display controls if a component should be visible or not
    const showerror=()=>(
        
        <div className="alert alert-danger" style={{display:error?"":"none"}}> 
            {error}
        </div>
    );

    const showSuccess=()=>(
        
        <div className="alert alert-info" style={{display:success?"":"none"} }> 
                New account is created, Please <Link to="/signin">SignIn</Link>.
        </div>
        
    );


    return(
    <Layout title="SignUpPage" description="Node React Ecommerce App" className="container col-md-8 offset-md-2">
        {showSuccess()}
        {showerror()}
        {SignUpform()}
        
    </Layout>

    );
    
    
}



export default Signup;