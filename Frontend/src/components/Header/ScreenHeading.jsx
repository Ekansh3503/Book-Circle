import React from 'react'

const ScreenHeading = ({pageTitle}) => {
  return (
    <div>
        <div className="flex items-center bg-white text-black px-6 py-4 rounded-[var(--br-radius)] space-y-5 2xl:space-y-8 text-2xl font-bold">
           <p> {pageTitle} </p>
        </div>
    </div>
  )
}

export default ScreenHeading