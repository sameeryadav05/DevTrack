import React, { useEffect } from 'react';
import { motion } from "motion/react"

const NotFound = () => {

  // Create stars dynamically
  useEffect(() => {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('span');
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      starsContainer.appendChild(star);
    }
    document.querySelector('.NotFound-Box').appendChild(starsContainer);
  }, []);

  return (
    <div className='NotFound-Box'>
      <img src='../public/fevicon.png'/>
      <h2 >Error : <motion.p initial={{y:-200}} animate={{y:0}} transition={{type:'spring',stiffness:1000,damping:20}} >404</motion.p></h2>

      <motion.h1 initial={{y:1000}} animate={{y:0}} transition={{duration:0.5}}>Page Not Found <span>!</span></motion.h1>
    </div>
  )
}

export default NotFound;
