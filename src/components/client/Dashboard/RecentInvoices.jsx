import React from "react";
import { useTable, useSortBy } from "react-table";
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
const RecentInvoices = ({ invoices }) => {
  const data = React.useMemo(() => invoices, [invoices]);

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
        accessor: "amountDue",
      },
      {
        Header: "Status",
        accessor: "status",
      }
    ],
    []
  );

  const hasDatePassed = (dueDate) => {
    const now = new Date();
    return dueDate < now;
  };

  
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <div className="bg-white p-6 flex flex-col rounded-md shadow-sm">
      <h1 className="mb-2 font-medium text-2xl  text-gray-700">
        Recent Invoices
      </h1>
      <table {...getTableProps()} className="w-full text-left p-4">

        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="text-gray-500 font-light"
            >
             {headerGroup.headers.map((column) => (
  <th
    {...column.getHeaderProps(column.getSortByToggleProps())}
    className="border-b border-gray-200 font-normal  p-4"  // add mb-4 for margin
  >
    <div className="flex items-center">
      {column.render("Header")}
      <span>
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
  </th>
))}



            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps() } className="">
        {rows.map((row, i) => {
  prepareRow(row);
  return (
    <tr
      {...row.getRowProps()}
      className={i % 2 === 0 ? "" : "bg-client"}
    >
     {row.cells.map((cell) => {
  // check if this is the status cell
  if (cell.column.id === 'status') {
    let color;
    switch (cell.row.values.status) {
      case 'paid':
        color = 'bg-cyan-500';
        break;
      case 'pending':
        color = 'bg-yellow-500';
        break;
      case 'open':
        color = hasDatePassed(new Date(cell.row.values.dueDate)) ? 'bg-red-500' : 'bg-gray-500';
        break;
      default:
        color = 'bg-gray-500';
        break;
    }
    return (
      <td {...cell.getCellProps()} className="px-4 py-2">
        <span className={`text-white px-3 py-1 text-sm  text-center  rounded-full ${color} `}>
          {cell.render("Cell")}
        </span>
      </td>
    );
  }
  // if not the status cell, render normally
  return (
    <td {...cell.getCellProps()} className="px-4 py-2">
      {cell.render("Cell")}
    </td>
  );
})}

    </tr>
  );
})}

        </tbody>
      </table>
    </div>
  );
};

export default RecentInvoices;
