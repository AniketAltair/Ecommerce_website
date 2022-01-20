// component made so as to check if user is authenticated or not

import React,{Component} from "react";
import {Route,Redirect} from 'react-router-dom';

import { isAuthenticated } from "./index";

const PrivateRoute = ({ component: Component, ...rest }) => ( // check react router dom for documentation of this, same code used
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/signin",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

export default PrivateRoute;
