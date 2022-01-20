

export const signup=(user)=>{
    //console.log(user);

    return fetch(`/auth/signup`,{
        method:"POST",
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json'
        },
        body:JSON.stringify(user) //used so that the backend accepts only JSON stringified method
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>{
        console.log(err);
    });
};

export const signin=(user)=>{
    //console.log(user);

    return fetch(`/auth/signin`,{
        method:"POST",
        headers:{
            Accept:'application/json',
            "Content-Type":'application/json'
        },
        body:JSON.stringify(user) //used so that the backend accepts only JSON stringified method
    })
    .then(response=>{
        return response.json();
    })
    .catch(err=>{
        console.log(err);
    });
};


export const authenticate=(data,next)=>{
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt",JSON.stringify(data));
        next();
    }
};

export const signout = next => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        next();
        return fetch(`/signout`, {
            method: 'GET'
        })
            .then(response => {
                console.log('signout', response);
            })
            .catch(err => console.log(err));
    }
};

export const isAuthenticated = () => {
    if (typeof window == 'undefined') {
        return false;
    }
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
};
