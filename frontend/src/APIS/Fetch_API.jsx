import React, { useEffect, useState } from 'react'
import axios from 'axios'


const Fetch_API = () => {
    const [Data ,setData]=useState();


    useEffect(()=>{
        
      const fetchData =async()=>{
        try{
        const responce =await axios.get('http://localhost:3000/api/v1/users/register');
       setData(responce.data);
        }
        catch(error){
            console.log(error)
        }
      }



       fetchData();
    
    
   
     
    },[])

  return (
    <>
    <p>{Data}</p>
    </>
  )
}

export default Fetch_API