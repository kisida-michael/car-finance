import React from 'react'

const PaymentMethods = ({currentUser}) => {
  return (
    <div className=' h-64 bg-white shadow-sm rounded-lg flex-grow '>
      <div className='flex flex-col p-6 '>
        <h1 className='mb-1 font-medium text-2xl  text-gray-700'>Payment Methods</h1>
        <h2 className='text-sm  text-gray-500'> Current Payment Method</h2>

     <div className='w-full px-8 py-10 mt-4 text-sm text-gray-500 bg-client font-medium rounded-md'>{currentUser.lastName}, {currentUser.firstName} </div>
        </div>
    </div>
  )
}

export default PaymentMethods
