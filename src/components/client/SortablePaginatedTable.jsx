import React from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";
import { useTable, useSortBy, usePagination } from "react-table";

const SortablePaginatedTable = ({ columns, data, pageSize, onRowClick }) => {
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
    { columns, data, initialState: { pageIndex: 0, pageSize } },
    useSortBy,
    usePagination
  );

  return (
    <div>
      <div className="block sm:hidden">
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <div key={i} className="p-4 mb-4 bg-client rounded-md">
              {row.cells.map((cell) => (
                <div key={cell.column.id} className="mb-2">
                  <strong className="text-gray-600">
                    {cell.column.Header}:{" "}
                  </strong>
                  {cell.render("Cell")}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <table
        {...getTableProps()}
        className="hidden sm:table w-full text-left p-4"
      >
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="text-gray-500 font-light"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="border-b border-gray-200 font-normal  p-4" // add mb-4 for margin
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

        <tbody {...getTableBodyProps()} className="">
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={i % 2 === 0 ? "" : "bg-client"}
              >
                {row.cells.map((cell) => {
                  // check if this is the status cell
                  if (cell.column.id === "status") {
                    let color;
                    switch (cell.row.values.status) {
                      case "paid":
                        color = "bg-cyan-500";
                        break;
                      case "Pending":
                        color = "bg-yellow-400";
                        break;
                      case "open":
                        color = hasDatePassed(new Date(cell.row.values.dueDate))
                          ? "bg-red-500"
                          : "bg-gray-500";
                        break;
                      default:
                        color = "bg-gray-500";
                        break;
                    }
                    return (
                      <td {...cell.getCellProps()} className="px-4 py-2">
                        <span className={`text-white  px-3 py-1 text-sm text-center rounded-full ${color}`}>
                          {cell.render("Cell")}
                        </span>
                      </td>
                    );
                  
                  } else if (cell.column.id === "action") {
                    return (
                      <td {...cell.getCellProps()} className=" px-4 py-2">
                        {cell.render("Cell")}
                      </td>
                    );
                  } else {
                    // if not the status or action cell, render normally
                    return (
                      <td {...cell.getCellProps()} className="px-4 py-2">
                        {cell.render("Cell")}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between mt-4 items-center space-x-2 w-full">
        <div className="space-x-1 sm:space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="p-2 rounded-lg bg-client text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            <FiChevronsLeft size={15} className="text-gray-600" />
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="p-2 rounded-lg bg-client text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            <FiChevronLeft size={15} className="text-gray-600" />
          </button>
        </div>
        <div className="font-semibold text-gray-500">
          Page {pageIndex + 1} of {pageCount}
        </div>
        <div className="space-x-1 sm:space-x-2">
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="p-2 rounded-lg bg-client text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            <FiChevronRight size={15} className="text-gray-600" />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="p-2 rounded-lg bg-client text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            <FiChevronsRight size={15} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortablePaginatedTable;
