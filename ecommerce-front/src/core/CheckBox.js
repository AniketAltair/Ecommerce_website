import React,{useState,useEffect} from "react";

const CheckBox=({categories,handleFilters})=>{

    const [checked,setchecked]=useState([]);

    const handleToggle=c=>()=>{
        const currentcategoryId=checked.indexOf(c);//returns -1 if not present in checked array
        const newCheckedCategoryId=[...checked];

        if(currentcategoryId === -1){
            newCheckedCategoryId.push(c);
        }else{
            newCheckedCategoryId.splice(currentcategoryId,1); //basically removes the array element
        }
        console.log(newCheckedCategoryId);
        setchecked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId)

    }


    return categories.map((c,i)=>(
        <li key={i} className="list-unstyled">
            <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id === -1)} type="checkbox" className="form-check-input"/>
            <label className="form-check-label">{c.name}</label>
        </li>
    ));
};


export default CheckBox;