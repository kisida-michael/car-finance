import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
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
import { useNavigate } from "react-router-dom";
import SortablePaginatedTable from "../SortablePaginatedTable";

const RecentInvoices = ({ invoices, stripeCustomer }) => {
  const data = React.useMemo(() => invoices, [invoices]);
  const navigate = useNavigate();
  const handlePayClick = (invoice) => {
    navigate("/user/billing", { state: { invoice} });
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Due Date",
        accessor: "dueDate",
       
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Amount Due",
        accessor: "subtotal",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: 'Action',
        accessor: 'action', // this is not an actual field in your data, just a placeholder for the action button
        Cell: ({ row }) => {
          if (row.original.status === "Pending") {
            return (
              <button
              onClick={() => handlePayClick(row.original)}
              className=" px-3 py-1 w-20 text-sm rounded-full bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Pay Now
              </button>
            );
          }

          if (row.original.status === "paid") {
            return (
              <button
              onClick={() => handlePayClick(row.original)}
              className=" px-3 py-1 w-20 text-sm rounded-full bg-gray-500 text-white hover:bg-cyan-600"
              >
                Details
              </button>
            );
          }
          return null;  // render nothing for non-draft invoices
        }
      }
    ],
    []
  );

  const hasDatePassed = (dueDate) => {
    const now = new Date();
    return dueDate < now;
  };

  
  
  return (
    <div className="bg-white p-6 flex flex-col rounded-md shadow-sm">
      <h1 className="mb-2 font-medium text-2xl  text-gray-700">
        Recent Invoices
      </h1>
      <SortablePaginatedTable
        columns={columns}
        data={data}
        pageSize={6}
        onRowClick={handlePayClick}
      />
    </div>
  );
};

export default RecentInvoices;
