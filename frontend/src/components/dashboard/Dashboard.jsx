import React, { useEffect, useState } from 'react'
import AuthStore from '../../store/AuthStore';
import API from '../../api/Axios';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import { MdCreateNewFolder } from "react-icons/md";
import {motion} from 'motion/react'


import { FaCalendarAlt, FaCode, FaUsers } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const events = [
  {
    id: 1,
    icon: <FaCode className="text-sm" />,
    title: "Google DevFest 2025",
    location: "Delhi, India",
    date: "12 Dec 2025",
    type: "Conference",
  },
  {
    id: 2,
    icon: <FaUsers className="text-sm" />,
    title: "MERN Stack Hackathon",
    location: "Online",
    date: "22 Dec 2025",
    type: "Hackathon",
  },
  {
    id: 3,
    icon: <FaCalendarAlt className="text-sm" />,
    title: "React India Meetup",
    location: "Bangalore",
    date: "05 Jan 2026",
    type: "Meetup",
  },
];


const Dashboard = () => {
    const [repositories,setRepositories] = useState([]);
    const [searchQuery,setSearchQuery] = useState("");
    const [suggestedRepositories,setSuggestedRepositories] = useState([]);
    const [searchResults,setSearchResults] = useState([])
    // const userId = AuthStore.getState().user.id;
    // console.log(userId)
    const navigate = useNavigate()

    useEffect(()=>{
        // const item = localStorage.getItem('Devtrack-token')
        // if(!item) return;
        // const userId = JSON.parse(item).state.user.id;

        const fetchRepositories = async ()=>
        {
            try {
                const response = await API.get('/repo/user');
                setRepositories(response.data.repositories);
                console.log(response.data.repositories)
            } catch (error) {
                console.log("not found")
                console.log(error.message)
            }
        }
        fetchRepositories();
        
    },[])

    useEffect(()=>{
        const fetchSuggestedRepositories = async ()=>
        {
            try {
                const response = await API.get('/repo/all');
                setSuggestedRepositories(response.data);
                // console.log(response.data)
                // console.log(repositories);
            } catch (error) {
                // toast.warn(error.message);
                console.log(error.message)
            }
        }
        fetchSuggestedRepositories();
        
    },[])

    useEffect(()=>{
        if(searchQuery == '')
        {
            setSearchResults(repositories);
        }
        else{
            const filteredRepo = repositories.filter((repo)=>repo.name.toLowerCase().includes(searchQuery.toLowerCase()))
            setSearchResults(filteredRepo);
        }

    },[searchQuery,repositories])


    return (
  <section className="min-h-screen w-full flex flex-col lg:flex-row bg-bgColor text-textColor">

    {/* ========== LEFT SIDEBAR ========== */}
    <aside

      className="w-full lg:w-[22%] border-b lg:border-b-0 lg:border-r bg-bgColor2 p-3 flex flex-col"
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-lg font-semibold">Top repositories</h1>
        <button className="flex gap-2 items-center bg-green-900 px-3 py-1 rounded-lg text-sm" onClick={()=>navigate('/create/repository')}>
          <MdCreateNewFolder className="text-lg" /> new
        </button>
      </div>

      <input
        className="w-full p-2 rounded-lg bg-transparent border text-sm mb-3"
        value={searchQuery}
        placeholder="Search repositories"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex-1 overflow-y-auto">
        {searchResults.map((repo) => (
          <div
            key={repo._id}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border">
              <img
                src={repo.owner.profileImage}
                className="w-full h-full object-cover"
              />
            </div>

            <a className="text-sm hover:underline cursor-pointer truncate">
              {repo.owner.username}/{repo.name}
            </a>
          </div>
        ))}
      </div>
    </aside>

    {/* ========== MAIN CONTENT ========== */}
    <main className="w-full lg:w-[56%] bg-bgColor flex-1 border-b lg:border-b-0 lg:border-r p-4">
      
    </main>


<motion.aside 
    initial={{ x: 300 }}
    animate={{ x: 0 }}
    transition={{ duration: 0.2 }}
 className="w-full lg:w-[20%] bg-bgColor2 p-4">
  <h3 className="text-sm font-semibold mb-3">
    Upcoming Events
  </h3>

  <div className="flex flex-col gap-3">
    {events.map((event) => (
        <a className='hover-3d'>
        <div
        key={event.id}
        className="flex gap-3 items-start rounded-lg bg-[#151922] p-3 hover:bg-[#191f29] transition border border-transparent hover:border-[#2b3240]"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#22293a] text-[#9da6ff]">
          {event.icon}
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold text-white">
            {event.title}
          </p>

          <p className="text-[11px] text-gray-400 mt-0.5">
            {event.location} • {event.type}
          </p>

          <p className="text-[10px] text-[#9da6ff] mt-1">
            📅 {event.date}
          </p>
        </div>
        </div>

          <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </a>
    ))}
  </div>
</motion.aside>


  </section>
);

}

export default Dashboard
