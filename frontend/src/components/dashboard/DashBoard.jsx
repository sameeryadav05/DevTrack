import React, { useEffect, useState } from 'react'
import API from '../../api/Axios';

const DashBoard = () => {
    const [repositories,setRepositories] = useState([]);
    const [searchQuery,setSearchquery] = useState('');
    const [suggestedRepositories,setSuggestedRepositories]= useState([]) 
    const [searchResult,setSearchResult] = useState([])

    useEffect(()=>{
        const item = localStorage.getItem('userData')
        const userData = JSON.parse(item)
        console.log(userData.id)


        const fetchRepositories =async ()=>{
            try {
                const response = await API.get(`/repo/user`)
                setRepositories(response.data.repositories)
                console.log(response.data.repositories);
            } catch (error) {
                console.log(error);
            }
        }
        const fetchSuggestedRepositories =async ()=>{
            try {
                const response = await API.get(`/repo/all`)
                console.log(response.data)
                setSuggestedRepositories(response.data)
            } catch (error) {
                console.log(error);
            }
        }

        fetchRepositories()
        fetchSuggestedRepositories();

    },[])

    useEffect(()=>{
        if(!searchQuery)
        {
            searchResult(repositories);
        }
        else{
            const filteredRepo = repositories.filter(repo=>repo.name.toLowerCase().includes(searchQuery.toLowerCase()))

            setSearchResult(filteredRepo)
        }

    },[searchQuery,repositories])
  return (
    <section className='DashBoard'>
        <aside>

        </aside>
        <main>

        </main>
        <aside>

        </aside>
    </section>
  )
}

export default DashBoard
