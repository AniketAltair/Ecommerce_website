import React, { useState, useEffect } from "react";
import { getCategories, list } from "./apiCore";
import Card from "./Card";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import RefreshIcon from '@mui/icons-material/Refresh';



const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });

    const [isListening, setIsListening] = useState(false);
    const [note, setNote] = useState(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const mic = new SpeechRecognition();

    mic.continuous = true
    mic.interimResults = true
    mic.lang = 'en-US';

    const { categories, category, search, results, searched } = data;
    // mic code
    const handleListen = () => {

        if (isListening) {
          mic.start()
          mic.onend = () => {
            console.log('continue..')
            mic.start()
          }
        } else {
          mic.stop()
          mic.onend = () => {
            console.log('Stopped Mic on Click')
          }
        }
        mic.onstart = () => {
          console.log('Mics on')
        }
    
        mic.onresult = event => {
            event.preventDefault();
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
            console.log("++++++++++++");  
          console.log(transcript)
          setNote(transcript);
          setData({...data,search:transcript});
          mic.onerror = event => {
            console.log(event.error)
          }
        }
      }
    
      //end mic code

    const loadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setData({ ...data, categories: data });
            }
        });
    };

    useEffect(() => {
        loadCategories();
        handleListen();
    }, [isListening]);

    const searchData = () => {
        // console.log(search, category);
        if (search) {
            list({ search: search || undefined, category: category }).then(
                response => {
                    if (response.error) {
                        console.log(response.error);
                    } else {
                        setData({ ...data, results: response, searched: true });
                    }
                }
            );
        }
    };

    const searchSubmit = e => {
        e.preventDefault();
        searchData();
    };  

    const onMic=()=>{
       
        
        setNote(null);
        setIsListening(prevState => !prevState);
        
    }

    const refresh=()=>{
        window.location.reload(false);
        
    }

    const handleChange = name => event => {
        setData({ ...data, [name]: event.target.value, searched: false });
    };

    const searchMessage = (searched, results) => {
        if (searched && results.length > 0) {
            return `Found ${results.length} products`;
        }
        if (searched && results.length < 1) {
            return `No products found`;
        }
    };

    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>

                <div className="row">
                    {results.map((product, i) => (
                        <div key={i} className="col-4 mb-3">
                            <Card  product={product} />
                        </div>
                            
                    
                    ))}
                </div>
            </div>
        );
    };

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select
                            className="btn mr-2"
                            onChange={handleChange("category")}
                        >
                            <option value="All">All</option>
                            {categories.map((c, i) => (
                                <option key={i} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="search"
                        className="form-control"
                        onChange={handleChange("search")}
                        placeholder={search} 
                        value={search}
                    />
                </div>
                <div
                    className="btn input-group-append"
                    style={{ border: "none" }}
                >
                    <IconButton onClick={onMic}  style={{margin:5}}     >
                         <MicIcon/>
                    </IconButton>
                    <IconButton onClick={refresh}  style={{margin:5}}     >
                         <RefreshIcon/>
                    </IconButton>
                    <button className="input-group-text">Search</button>
                </div>
                
            </span>
           
        </form>
    );

    return (
        <div className="row">
            <div className="container mb-3">{searchForm()}</div>
            <div className="container-fluid mb-3">
                {searchedProducts(results)}
            </div>
        </div>
    );
};

export default Search;