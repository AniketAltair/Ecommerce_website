
import queryString from "query-string";

export const read = (userId,token) => {
    return fetch(`/user/user/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:`Bearer ${token}`
        },
    })
        .then(response => {
            
            return response.json();
        })
        .catch((err) => {
            console.log(err);
        });
};

export const update = (userId,token,user) => {
    return fetch(`/user/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const updateUser=(user,next)=>{  // done to update profile immediately in local storage. if not done, changes will only
    if (typeof window !== "undefined") { // reflect when signout and then again sign in
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }                                 
};

export const getPurchaseHistory = (userId, token) => {
    return fetch(`/user/orders/by/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};