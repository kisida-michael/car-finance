import React, { useState, Fragment } from 'react';
import { FiMail, FiClock, FiTag, FiMoreVertical, FiEdit, FiTrash, FiDollarSign } from 'react-icons/fi';
import { Menu, Dialog, Transition } from '@headlessui/react';

const InvoiceCard = ({ invoice, isEvenRow, }) => {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500'
      case 'processing':
        return 'bg-yellow-500'
      case 'draft':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div
      className={`bg-card p-2 rounded-lg mb-2 flex items-center font-regular ${
        isEvenRow ? "bg-card" : "bg-cardAlt"
      }`}
    >
      <div className="flex flex-1 items-center space-x-4">
        <FiTag className="mr-2 text-2xl text-cyan-500 font-bold" />
        <div className="flex-1">{invoice.customerName}</div>
        <div className="ml-8 flex-1 flex items-center space-x-2">
          <FiClock className="mr- -ml-11 text-cyan-500 font-bold" />
          <div>
  {invoice.dueDate.toLocaleDateString('en-US', {
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  })}
</div>
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <FiMail className="mr-2 -ml-9 text-cyan-500 font-bold" />
          <div>{invoice.type}</div>
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <FiDollarSign className="mr- -ml-7 text-cyan-500 font-bold" />
          <div>{invoice.amountDue.toFixed(2)}</div>

        </div>
        <div className='flex-1'>
        <span className={`mr-8 px-3 -ml-5 inline-flex text-xs leading-5 font-semibold rounded-full py-1  ${getStatusBadgeColor(invoice.status)} text-white`}>
          {invoice.status}
        </span>
        </div>
      </div>

      {/* <Menu as="div" className="relative rounded-md inline-block text-left">
        <div>
          <Menu.Button className="text-2xl cursor-pointer">
            <FiMoreVertical />
          </Menu.Button>
        </div>
        <Menu.Items className="absolute rounded-md right-0 w-28 mt-2 origin-top-right bg-[#1A1926]  divide-y divide-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <Menu.Item>
            {({ active }) => (
              <div className={`py-1 px-4 text-white  ${active ? 'bg-gray-800' : ''} cursor-pointer`}>
               <div className='flex items-center'>
               <FiEdit className='mr-2'/><span>Edit</span>
               </div>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button onClick={openModal} className={`py-1 px-4 text-white  ${active ? 'bg-gray-800' : ''} cursor-pointer`}>
                  <div className='flex items-center'>
               <FiTrash className='mr-2'/><span>Delete</span>
               </div>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu> */}
    </div>
  );
};

export default InvoiceCard;
