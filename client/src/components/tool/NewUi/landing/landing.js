import React from 'react'
import './landing.css'
import Chat from './Chat'
import RightSection from './rightSection.js'
export default () => {
  return (
    <div className="landingContainer">
      <div className="leftSection">
          <Chat />
      </div>
      <div>
        <RightSection />

      </div>
    </div>
  )
}
