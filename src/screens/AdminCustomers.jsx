import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { firestore } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CustomerCard from "../../src/components/admin/adminCustomers/CustomerCard";
import CustomerDetails from "../../src/components/admin/adminCustomers/CustomerDetails";
import AddCustomer from "../../src/components/admin/adminCustomers/AddCustomer";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const tableColumns = [
  {
    Header: "Name",
    accessor: "fullName",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
];

const AdminCustomers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addingCustomer, setAddingCustomer] = useState(false);

  const [data, setData] = useState([]); // Will hold the customer data from Firestore

  const fetchData = async () => {
    const customersRef = collection(firestore, "customers");
    const customersSnapshot = await getDocs(customersRef);

    setData(customersSnapshot.docs.map((doc) => doc.data()));
    console.log(data);
  };
  useEffect(() => {
    fetchData();
  }, []);


  const handleOpenModal = (customer) => {
    console.log("modal opened");
  };
  
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
      data: data,
      initialState: { pageIndex: 0, pageSize: 12 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="w-full bg-admin min-h-screen text-gray-200">
      <div className="flex flex-grow">
        <div className="mx-8 mt-8 w-full flex-grow flex flex-col">
          <header className=" flex mb-4 justify-between items-center">
            <h1 className="mt-8 text-2xl font-semibold">Customers</h1>
            <button
              className="bg-cyan-500 text-gray-200 px-4 py-2 rounded-lg"
              onClick={() => setAddingCustomer(true)}
            >
              Add Customer
            </button>
          </header>
          {headerGroups.map((headerGroup) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              className="flex mb-2 mt-4"
            >
              {headerGroup.headers.map((column) => (
                <div
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="font-semibold flex flex-1 ml-16  opacity-70" // Note the added 'flex-1'
                >
                  {column.render("Header")}
                  <span className="mt-1">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronUp />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <CustomerCard
                  key={row.original.email}
                  customer={row.original}
                  onClick={() => {
                    setSelectedCustomer(row.original);
                    setAddingCustomer(false);
                  }}
                  onOpenModal={() => handleOpenModal(row.original)}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>
            <div>
              Page {pageIndex + 1} of {pageCount}
            </div>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>
          </div>
        </div>

        {selectedCustomer && !addingCustomer && (
          <CustomerDetails
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}

        {addingCustomer && (
          <AddCustomer
            onClose={() => setAddingCustomer(false)}
            onAdd={() => {
              setAddingCustomer(false);
              fetchData(); // Refresh the customer data
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
