import { useEffect, useState } from 'react'
import Loader from './components/Loader'
import axios from 'axios'
import { toast } from 'react-toastify'

function App() {
  const [results,setResults] =useState([])
  const [loading,setLoading] =useState(true)
  let count = localStorage.getItem('search_count') || 0
  // console.log(count);
  
   const [search,setSearch]= useState('')

   const getSavedUserQueries= async()=>{
    try {
      setLoading(true)
      const result  = await axios.get('https://query-feature-backend.onrender.com/api/v1/queryFeature/getSavedQueries')
      // console.log(result?.data);
      setResults(result?.data?.data)
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }

   }

   useEffect(()=>{
    getSavedUserQueries()
   },[])

   const handleSearch = async(e)=>{
    count = localStorage.getItem('search_count') || 0
    console.log(count);
    e.preventDefault()
    if(!search.trim()) return toast.error("please enter something")
      count++
     localStorage.setItem("search_count",count) 
    if(count%10!==0) {
      return toast.success(`sucess! but please search ${10-(count%10)} more time to save in db `)
    }
      // console.log("ssucesss");
    const result = await saveUserEvery10thQuery(search)
    // console.log(result);
    // toast.success(result?.flag_message)
    toast.success('FINALLY,Query Saved Successfully!!!')
     getSavedUserQueries();
    
      

   }

   async function saveUserEvery10thQuery (queryString){
    try {
      const payload= {queryString}
      const result = await axios.post('https://query-feature-backend.onrender.com/api/v1/queryFeature/saveUserQueries',payload)
      // console.log(result);
      return result?.data
      
    } catch (error) {
      throw error
      
    }

   }

  return (
    <>
     <div className="container mt-5">
      <h3>Search Box</h3>
      <input
        type="text"
        className="form-control"
        placeholder="Search query..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />
       <button className="btn btn-primary mt-2" onClick={handleSearch} >
          Search
        </button>
    </div>
    {loading ?  <Loader/>:  <>
     

     <div className="border p-3 mt-4" style={{ minHeight: '100px' }}>
      <h3>Saving every 10th searched query</h3>

        {results.length > 0 ? (
          <ul className="list-group">
            {results.map((item) => (
              <li key={item?.id} className="list-group-item text-success">
                {item?.query_string}
              </li>
            ))}
          </ul>
        ) : (
          <p >No records found</p>
        )}
      </div>
      </>

      }
    </>
  )
}

export default App
