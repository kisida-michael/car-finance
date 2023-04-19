import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from "react-table";
import Modal from "react-modal";

const MOCK_DATA = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "John De",
    email: "john@example.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },
  {
    name: "Michael Kisida",
    email: "michael@kisida.com",
    phone: "555-555-5555",
    balance: 100,
    terms: "30 days",
  },

  // Add more customer data
];
const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Phone',
    accessor: 'phone',
  },
];

const AdminCustomers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns: tableColumns,
      data: MOCK_DATA,
      initialState: { pageIndex: 0, pageSize: 12 },
    },
    useSortBy,
    usePagination,
  );

  const CustomerCard = ({ row }) => {
    const { original } = row;
    return (
      <div
        className="bg-card p-4 rounded-lg mb-2 flex justify-between items-center cursor-pointer"
        onClick={() => setSelectedCustomer(original)}
      >
        <div>{original.name}</div>
        <div>{original.email}</div>
        <div>{original.phone}</div>
      </div>
    );
  };

  return (
    <div className="w-full p-8 bg-admin min-h-screen text-gray-200">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <button className="bg-blue-600 text-gray-200 px-4 py-2 rounded-lg">Add Customer</button>
      </header>
      <div className="mt-8">
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="flex justify-between mb-2">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps(column.getSortByToggleProps())} className="font-bold">
                {column.render('Header')}
                <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
              </div>
            ))}
          </div>
        ))}
        <div {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return <CustomerCard row={row} />;
          })}
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          <div>
            Page {pageIndex + 1} of {pageCount}
          </div>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>
      </div>
      {selectedCustomer && (
        <div className="fixed top-0 right-0 w-80 h-screen bg-card text-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">{selectedCustomer.name}</h2>

          
          <div className="mb-2">
            <span className="font-bold">Email:</span> {selectedCustomer.email}
          </div>
          <div className="mb-2">
            <span className="font-bold">Phone:</span> {selectedCustomer.phone}
          </div>
          <div className="mb-2">
            <span className="font-bold">Balance:</span> ${selectedCustomer.balance.toFixed(2)}
          </div>
          <div className="mb-2">
            <span className="font-bold">Terms:</span> {selectedCustomer.terms}
          </div>
          <button
            className="mt-4 bg-red-600 text-gray-200 px-4 py-2 rounded-lg"
            onClick={() => setSelectedCustomer(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
