import React from 'react'

const Shorts = () => {
  return (
   <>
   <div className='flex flex-col text-white items-center justify-center'>Shorts</div>
   <div className='flex flex-col gap-4 p-4 items-center justify-center h-screen'>
    <h1 className='text-2xl font-bold'>Shorts</h1>
    <p className='text-sm text-gray-500'>Manage your shorts and see your favorite shorts.</p>
    <div className='flex flex-col gap-4 p-4 items-center justify-center h-screen'>
        <h2 className='text-xl font-bold'>Shorts</h2>
        <p className='text-sm text-gray-500'>Manage your shorts and see your favorite shorts.</p>
    </div>
   </div>
   </>
  )
}

export default Shorts