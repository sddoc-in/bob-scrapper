import React from "react";
import DropDown from "./DropDown";

export default function FilterOpener({
  value,
  clear,
  filterData,
  search,
  setSearch,
  filterType,
  setFilterType,
  index,
  hideColumn,
  isChanging,
  setIsChanging,
}: any) {
  return (
    <>
      <ul
        tabIndex={index}
        className="dropdown-content menu p-2 bg-white shadow  w-52"
      >
           <p
          className="px-2  text-green-600 text-[14px] break-all w-[90%] cursor-pointer"
          onClick={() =>
            setIsChanging({
              ...isChanging,
              status: true,
              columnIndex: index,
              header: true,
              value: value,
            })
          }
        >
          {value}
        </p>
        <div className="divider my-0"></div>
        <p
          className="px-2  text-[14px] text-blue-600 cursor-pointer"
          onClick={() => hideColumn(index)}
        >
          Hide
        </p>
        <DropDown filterType={filterType} setFilterType={setFilterType} />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[95%] mx-auto px-2 text-[12px] py-1 my-1 border border-black bg-white  rounded-none focus:outline-none"
          placeholder="Search"
        />
        <div className="flex justify-between items-center w-[90%] mx-auto">
          <button
            onClick={() => filterData(index)}
            className="border px-1 text-[12px] text-blue-600  my-1"
          >
            Search
          </button>
          <button
            onClick={() => clear(index)}
            className="border px-1 text-[12px] text-blue-600 py- my-1"
          >
            Clear
          </button>
        </div>
      </ul>
    </>
  );
}
