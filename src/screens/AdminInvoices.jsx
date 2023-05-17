import React, { useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { firestore } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import InvoiceCard from "../../src/components/admin/adminInvoices/InvoiceCard";
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

const tableColumns = [
  {
    Header: "Name",
    accessor: "customerName",
  },
  {
    Header: "Due Date",
    accessor: "dueDate",
  },
  {
    Header: "Type",
    accessor: "type",
  },
  {
    Header: "Amount",
    accessor: "amountDue",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const AdminInvoices = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [addingInvoice, setAddingInvoice] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [search, setSearch] = useState("");
  const [isInitialRender, setIsInitialRender] = useState(true); // New state variable to track if this is the initial render
  const [isDataFetched, setIsDataFetched] = useState(false); // New state variable to track if data has been fetched

  const [data, setData] = useState([]); // Will hold the invoice data from Firestore

  const fetchData = async () => {
    const invoicesRef = collection(firestore, "invoices");
    const invoicesSnapshot = await getDocs(invoicesRef);

    setData(
      invoicesSnapshot.docs.map((doc) => {
        const data = doc.data();

        // If dueDate exists and is a Timestamp, convert to Date\

        if (data.dueDate) {
          data.dueDate = new Date(data.dueDate * 1000); // Multiply by 1000 to convert from seconds to milliseconds
        }

        return data;
      })
    );
    setIsDataFetched(true); // Set isDataFetched to true after the data is fetched

    // console.log(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Define debouncedSearch function here
  const debouncedSearch = useCallback(
    debounce((search) => {
      if (isDataFetched) {
        // Only run search if data has been fetched        console.log('Searching...', search)
        setSearchedData(
          data.filter(
            (invoice) =>
              (invoice.customerName &&
                invoice.customerName
                  .toLowerCase()
                  .includes(search.toLowerCase())) ||
              (invoice.email &&
                invoice.email.toLowerCase().includes(search.toLowerCase())) ||
              (invoice.type &&
                invoice.type.toLowerCase().includes(search.toLowerCase())) ||
              (invoice.status &&
                invoice.status.toLowerCase().includes(search.toLowerCase()))
          )
        );
      } else {
      }
    }, 300),
    [data, isDataFetched] // Add isInitialRender to the dependency array
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
    } else {
      debouncedSearch(search);
    }
  }, [search, debouncedSearch, data]);

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
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useSortBy,
    usePagination
  );
  return (
    <div className="w-full bg-admin min-h-screen text-gray-200">
      <div className="flex flex-grow ">
        <div className="mx-12 mt-8 w-full flex-grow flex flex-col overflow">
          <header className="flex mb-4 justify-between items-center">
            <h1 className="mt-8 text-2xl font-semibold">Invoices</h1>
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
              <button className="ml-4 bg-cyan-600 text-gray-200 px-4 py-2 rounded-lg hover:bg-cyan-500 transition duration-200 ease-in-out">
                Add Invoice
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
                  className="font-semibold flex flex-1 opacity-70" // Note the added 'flex-1'
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
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <InvoiceCard
                  key={row.original.id}
                  invoice={row.original}
                  fetchData={fetchData}
                  onClick={() => {
                    setSelectedInvoice(row.original);
                    setAddingInvoice(false);
                  }}
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

        {selectedInvoice && !addingInvoice && (
          <InvoiceDetails
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}

        {addingInvoice && (
          <ModifyInvoice
            onClose={() => setAddingInvoice(false)}
            onAdd={() => {
              setAddingInvoice(false);
              fetchData(); // Refresh the invoice data
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminInvoices;
