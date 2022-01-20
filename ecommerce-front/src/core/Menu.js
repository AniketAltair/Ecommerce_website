import React,{Fragment} from "react";
import {Link,withRouter} from 'react-router-dom';
import { signout,isAuthenticated } from "../auth/index";
import { itemTotal } from "./cartHelpers";


const isActive=(history,path)=>{
    if(history.location.pathname===path){
        return{
            color:"#ffffff"
        }
    }else{
        return{
            color:"#000000"
        }
    }
}

const Menu=({history})=>(

<nav className="navbar navbar-expand-lg navbar-light bg-success">
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
       <span className="navbar-toggler-icon"></span>
    </button>
   <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div className="navbar-nav" >
        <Link className="nav-item nav-link active" style={isActive(history,'/')} to="/">Home <span className="sr-only">(current)</span></Link>
        <Link className="nav-item nav-link active" style={isActive(history,'/shop')} to="/shop">Shop</Link>
        <Link className="nav-item nav-link active" style={isActive(history,'/cart')} to="/cart">Cart{" "} <sup>
                        <small className="cart-badge">{itemTotal()}</small>
                    </sup></Link>

        {isAuthenticated() && isAuthenticated().user.role === 0 && 
        <Link 
        className="nav-item nav-link active" 
        style={isActive(history,'/user/dashboard')} 
        to="/user/dashboard"
        >
            DashBoard
        </Link>}

        {isAuthenticated() && isAuthenticated().user.role === 1 && 
        <Link 
        className="nav-item nav-link active" 
        style={isActive(history,'/admin/dashboard')} 
        to="/admin/dashboard"
        >
            DashBoard
        </Link>}


        {!isAuthenticated() && (
            <Fragment>
                <Link className="nav-item nav-link active" style={isActive(history,'/signup')} to="/signup">SignUp</Link>
                <Link className="nav-item nav-link active" style={isActive(history,'/signin')} to="/signin">SignIn</Link>
            </Fragment>
        )}
        {isAuthenticated() && (
            <span className="nav-item nav-link active" style={{cursor:"pointer",color:'#000000'}} onClick={()=>signout(()=>{
                history.push("/");
            })}>SignOut</span>
        )}
        
      </div>
   </div>
</nav>
);

export default withRouter(Menu);

