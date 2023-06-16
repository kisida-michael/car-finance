import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { firestore } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CustomerCard from "../../src/components/admin/adminCustomers/CustomerCard";
import CustomerDetails from "../../src/components/admin/adminCustomers/CustomerDetails";
import AddCustomer from "../components/admin/adminCustomers/forms/AddCustomer";
import {
  FiChevronDown,
  FiChevronUp,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import { debounce } from "lodash";
import { AnimatePresence } from "framer-motion";

const tableColumns = [
  {
    Header: "Name",
    accessor: "name",
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

const AdminLeads = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [search, setSearch] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false); // New state variable to track if data has been fetched
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [data, setData] = useState([]); // Will hold the customer data from Firestore

  console.log('leads')
  const fetchData = async () => {
    const customersRef = collection(firestore, "leads");
    const customersSnapshot = await getDocs(customersRef);

    setData(customersSnapshot.docs.map((doc) => doc.data()));
    console.log(data);
    setIsDataFetched(true); // Set isDataFetched to true after the data is fetched
  };

  
  useEffect(() => {
    fetchData();
  }, []);
  // Define debouncedSearch function here
  const debouncedSearch = useCallback(
    debounce((search) => {
      if (isDataFetched) {
        // Only run search if data has been fetched        console.log('Searching...', search)
        console.log("Searching...", search);

        setSearchedData(
          data.filter(
            (customer) =>
              (customer.name &&
                customer.name
                  .toLowerCase()
                  .includes(search.toLowerCase())) ||
              (customer.email &&
                customer.email.toLowerCase().includes(search.toLowerCase())) ||
              (customer.phone &&
                customer.phone.toLowerCase().includes(search.toLowerCase()))
          )
        );
      } else {
      }
    }, 300),
    [data, isDataFetched]
  );

  // Define handleSearch function here
  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearch(searchText);
  };

  // Apply the useEffect hook here
  useEffect(() => {
    if (search === "") {
      debouncedSearch("");
      // setSearchedData(data);
    } else {
      debouncedSearch(search);
    }
  }, [search, debouncedSearch, data]);

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
      data: searchedData !== null ? searchedData : data,
      initialState: { pageIndex: 0, pageSize: 13 },
    },
    useSortBy,
    usePagination
  );
  return (
    <div className="w-full bg-admin min-h-screen text-gray-200">
      <div className="flex lg:flex-row md:flex-col">
        {(!isSmallScreen || (!selectedCustomer && !addingCustomer)) && (
          <div className="lg:mx-12 lg:mt-8  lg:flex-grow flex flex-col overflow-auto">
            <header className="flex mb-4 justify-between items-center">
              <h1 className="mt-8 text-2xl font-semibold">Leads</h1>
              <div className="mr-4 flex items-center">
                <div className="flex items-center bg-card px-2 rounded-lg focus-within:border-cyan-500 focus-within:border-2">
                  <FiSearch className="text-gray-200" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearch}
                    className="ml-2 flex-grow text-gray-200 border-none focus:border-none focus:ring-0 active bg-card outline-none min-w-0"
                  />
                  {search && (
                    <FiXCircle
                      className="text-gray-200 cursor-pointer"
                      onClick={() => setSearch("")} // clears the search input
                    />
                  )}
                </div>
                <button
                  className="ml-4 bg-cyan-600 text-gray-200 px-4 py-2 rounded-lg hover:bg-cyan-500 transition duration-200 ease-in-out"
                  onClick={() => setAddingCustomer(true)}
                >
                  Add Customer
                </button>
              </div>
            </header>
            {headerGroups.map((headerGroup) => (
              <div
                {...headerGroup.getHeaderGroupProps()}
                className="flex mb-2 mt-4"
              >
                {headerGroup.headers.map((column) => (
                  <div
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="font-semibold flex flex-1 opacity-70"
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
            <div {...getTableBodyProps()} className="">
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <CustomerCard
                    key={row.original.email}
                    customer={row.original}
                    fetchData={fetchData}
                    onClick={() => {
                      setSelectedCustomer(row.original);
                      setAddingCustomer(false);
                    }}
                    onOpenModal={() => handleOpenModal(row.original)}
                    isEvenRow={index % 2 === 0} // Pass the isEvenRow prop to the CustomerCard component
                  />
                );
              })}
            </div>

            <div className="flex justify-between mt-4 items-center space-x-2">
              <div className="space-x-2">
                <button
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                  className="p-2 rounded-lg bg-card text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                  <FiChevronsLeft size={20} />
                </button>
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="p-2 rounded-lg bg-card text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                  <FiChevronLeft size={20} />
                </button>
              </div>
              <div className="font-semibold">
                Page {pageIndex + 1} of {pageCount}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="p-2 rounded-lg bg-card text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                  <FiChevronRight size={20} />
                </button>
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                  className="p-2 rounded-lg bg-card text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                  <FiChevronsRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedCustomer && !addingCustomer && (
          <div className="w-full lg:w-1/3  ">
            <CustomerDetails
              customer={selectedCustomer}
              onClose={() => setSelectedCustomer(null)}
            />
          </div>
        )}

        {addingCustomer && (
          <div className="w-full lg:w-1/3 ">
            <AddCustomer
              onClose={() => setAddingCustomer(false)}
              onAdd={() => {
                setAddingCustomer(false);
                fetchData(); // Refresh the customer data
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeads
