import React from 'react'
import SidebarLinks from './SidebarLinks'
// import { SidebarLinks } from '.'
const Bottombar = () => {
  return (
   <footer className='bottombar'>
      <div className="bottombar_container">
        <SidebarLinks bottombarType={true} />
      </div>
   </footer>
  )
}

export default Bottombar