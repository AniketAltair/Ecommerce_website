

export const createCategory = (userId, token, category) => {
    return fetch(`/api/category/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
        .then(response => {
            console.log("______________222");
            console.log(response);
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const createProduct = (userId, token, product) => {
    return fetch(`/api/product/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',            // no application content cause we will be sending form data
            Authorization: `Bearer ${token}`
        },
        body: product
    })
        .then(response => {
            console.log("______________111");
            console.log(response);
            return response.json();
        })
        .catch(err => {
            console.log(")))))))))))))))))))))222");
            console.log(err);
        });
};


export const getCategories = () => {
    return fetch(`/api/categories`, {
        method: 'GET'
    })
        .then(response => {
            console.log("______________");
            console.log(response);
            return response.json();
        })
        .catch((err) => {console.log(")))))))))))))))))))))");
            console.log(err);});
};

export const listOrders = (userId, token) => {
    return fetch(`/api/order/list/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getStatusValues = (userId, token) => {
    return fetch(`/api/order/status-values/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateOrderStatus = (userId, token, orderId, status) => {
    return fetch(`/api/order/${orderId}/status/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, orderId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getProducts = () => {
    return fetch(`/api/products?limit=10000`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const deleteProduct = (productId, userId, token) => {
    return fetch(`/api/product/${productId}/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getProduct = productId => {
    return fetch(`/api/product/${productId}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateProduct = (productId, userId, token, product) => {
    return fetch(`/api/product/${productId}/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: product
    })
        .then(response => {
            return response.json();
        })  
        .catch(err => console.log(err));
};




