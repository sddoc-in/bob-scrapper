import React from "react";
import { useCollapse } from "react-collapsed";
import { AiFillCaretDown } from "react-icons/ai";

export default function DropDown({ filterType, setFilterType }: any) {
  const { getCollapseProps, getToggleProps, setExpanded } = useCollapse();

  const filters = [
    "begins with",
    "ends with",
    "contains",
    "does not contain",
    "equals",
    "does not equal",
    'is not',
    "matches regex",
    "does not match regex",
    "matches"
  ];

  return (
    <>
      <div
        {...getToggleProps()}
        className="flex justify-start items-center cursor-pointer"
      >
        <p className="px-2  text-[12px] text-blue-600 ">{filterType}</p>
        <AiFillCaretDown className="text-blue-600 text-[12px]" />
      </div>
      <div {...getCollapseProps()}>
        {filters.map((item: any, index: number) => {
          return (
            <p
              key={index}
              onClick={() => {
                setExpanded(false);
                setFilterType(item);
              }}
              className="px-2  text-[12px] text-blue-600 cursor-pointer"
            >
              {filterType===item?"":item}
            </p>
          );
        })}
      </div>
    </>
  );
}
