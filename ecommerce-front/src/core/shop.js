import React from "react";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import Card from "./Card";
import { getCategories,getfilteredProducts } from "./apiCore";
import CheckBox from "./CheckBox";
import { prices } from "./fixedPrices";
import RadioBox from "./RadioBox";

const Shop=()=>{

    const [myFilters,setMyfilters]=useState({
        filters:{category:[],price:[]}
    });
    const [categories,setCategories]=useState([]);
    const [error,setError]=useState(false);

    const [limit,setlimit]=useState(4);
    const [skip,setskip]=useState(0);
    const [size,setsize]=useState(0);

    const [filteredresults,setfilteredresults]=useState([]);

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setCategories(data);
            }
        });
    };

    const loadFilterResults=newFilters=>{
        //console.log(newfilters);
        getfilteredProducts(skip,limit,newFilters).then(data=>{
            if(data.error){
                setError(data.error);
            }else{
                setfilteredresults(data.data);
                setsize(data.size);
                setskip(0);
            }
        });
    };

    const loadmore=()=>{
        let toSkip= skip+limit;
        //console.log(newfilters);
        getfilteredProducts(toSkip,limit,myFilters.filters).then(data=>{
            if(data.error){
                setError(data.error);
            }else{
                setfilteredresults([...filteredresults,...data.data]);
                setsize(data.size);
                setskip(toSkip);
            }
        });
    }; 
    
    const loadmoreButton=()=>{
        return (
            size>0 && size>=limit && (
                <button onClick={loadmore} className="btn btn-warning mb-5">Load More</button>
            )
        );
    };

    useEffect(()=>{
        init();
        loadFilterResults(skip,limit,myFilters.filters);
    },[]);



    const handleFilters =(filters,filterBy)=>{
        //console.log('shop',filters,filterBy);
        const newFilters={...myFilters};
        newFilters.filters[filterBy]=filters;

        if(filterBy=="price"){
            let priceValue = handlePrice(filters);
            newFilters.filters[filterBy]=priceValue;
        }
        loadFilterResults(myFilters.filters);
        setMyfilters(newFilters);
    };

    const handlePrice = value => {
        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    };


    

    // always wrap lixt component in unordered list component. below checkbox returns list component, 
    // which is wrapped in <ul> (unordered list)
    

    return (
        <Layout
            title="Shop Now !!!"
            description="Search and find Your Products"
            className="container-fluid" 
        >
           <div className="row">
               <div className="col-4">
                   <h4>Filter By Categories</h4>
                   <ul>
                   <CheckBox categories={categories} handleFilters={filters=>handleFilters(filters,"category")}/>
                   </ul>
                   <h4>Filter By Prices</h4>
                   <div>
                   <RadioBox prices={prices} handleFilters={filters=>handleFilters(filters,"price")}/>
                   </div>
                  
               </div>
               <div className="col-8">
               <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredresults.map((product, i) => (
                             
                                 <div key={i} className="col-4 mb-3">
                                    <Card product={product}/>
                                 </div>
                             
                        ))}
                    </div>
                    <hr />
                    {loadmoreButton()}
                    
               </div>
           </div>
            
        </Layout>
    );
}

export default Shop;