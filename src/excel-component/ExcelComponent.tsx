import React from "react";
import { TiTick, TiTickOutline } from "react-icons/ti";
import FilterOpener from "./FilterOpener";
import { HiddenColumns } from "./HiddenColumns";
import { ExcelContext } from "../context/ExcelContext";
import { MainContext } from "../context/Context";
import { PARTNERS, PRICE, RATING, TOTAL_REVIEW } from "../constant/data";

export default function ExcelComponent() {
  const {
    fileData,
    header,
    setHeader,
    selected,
    setSelected,
    columnsHidden,
    setColumnsHidden,
  } = React.useContext(ExcelContext);

  const { setLoading, themeObj } = React.useContext(MainContext);

  const [data, setData] = React.useState<any>(fileData);
  const [search, setSearch] = React.useState<string>("");
  const [filterType, setFilterType] = React.useState<string>("begins with");

  const [isChanging, setIsChanging] = React.useState<any>({
    status: false,
    header: false,
    rowIndex: null,
    columnIndex: null,
    value: "",
  });

  const [filterRecord, setFilterRecord] = React.useState<any>([]);

  function filterData(where: number) {
    setLoading(true);
    let newData = data;
    if (search !== "") {
      newData = data.filter((item: any, index: number) => {
        if (filterType === "begins with")
          return item[where]
            .toString()
            .toLowerCase()
            .startsWith(search.toLowerCase());
        if (filterType === "ends with")
          return item[where]
            .toString()
            .toLowerCase()
            .endsWith(search.toLowerCase());
        if (filterType === "contains")
          return item[where]
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());
        if (filterType === "does not contain")
          return !item[where]
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase());
        if (filterType === "equals")
          return item[where].toString().toLowerCase() === search.toLowerCase();
        if (filterType === "does not equal")
          return item[where].toString().toLowerCase() !== search.toLowerCase();
        if (filterType === "is not")
          return item[where].toString().toLowerCase() !== search.toLowerCase();
        if (filterType === "matches regex")
          return item[where].toString().toLowerCase().match(search);
        if (filterType === "does not match regex")
          return !item[where].toString().toLowerCase().match(search);
        if (filterType === "matches")
          return item[where]
            .toString()
            .toLowerCase()
            .match(search.toLowerCase());
        return item[where]
          .toString()
          .toLowerCase()
          .startsWith(search.toLowerCase());
      });
    }
    // sorting array of arrays
    if (filterType === "Ascending") {
      newData.sort(function (a: any, b: any) {
        if (
          where === RATING ||
          where === PRICE ||
          where === TOTAL_REVIEW ||
          where === PARTNERS
        ) {
          const priceA = parseFloat(a[where]);
          const priceB = parseFloat(b[where]);
          return priceA - priceB;
        } else {
          const priceA = a[where].toLowerCase();
          const priceB = b[where].toLowerCase();
          return priceA.localeCompare(priceB);
        }
      });
    }
    if (filterType === "Descending") {
      newData.sort(function (a: any, b: any) {
        if (
          where === RATING ||
          where === PRICE ||
          where === TOTAL_REVIEW ||
          where === PARTNERS
        ) {
          const priceA = parseFloat(a[where]);
          const priceB = parseFloat(b[where]);
          return priceB - priceA;
        } else {
          const priceA = a[where].toLowerCase();
          const priceB = b[where].toLowerCase();
          return priceB.localeCompare(priceA);
        }
      });
    }
    setFilterRecord([...filterRecord, { where: newData }]);
    setData(newData);
    setSearch("");
    setLoading(false);
  }

  function hideColumn(index: number) {
    setColumnsHidden([...columnsHidden, index]);
  }
  function clear(index: number) {
    // const newData = data.filter((item: any, index: number) => {
    //     return item[where].includes(search)
    // })
    setSearch("");
    setData(fileData);
  }
  function selectItem(item: any) {
    if (selected.includes(item)) {
      const unselect = selected.filter((row: any) => {
        return row !== item;
      });
      setSelected(unselect);
      return;
    }
    const newData = [...selected, item];
    setSelected(newData);
  }

  function changeCell() {
    const newData = [...data];
    newData[isChanging.rowIndex][isChanging.columnIndex] = isChanging.value;
    setData(newData);
    setIsChanging({
      status: false,
      header: false,
      rowIndex: null,
      columnIndex: null,
      value: "",
    });
  }
  function changeHeaderCell() {
    const newData = [...header];
    newData[isChanging.columnIndex] = isChanging.value;
    setHeader(newData);
    setIsChanging({
      status: false,
      header: false,
      rowIndex: null,
      columnIndex: null,
      value: "",
    });
  }

  const classes = " w-[99%] h-[80vh] mx-auto";
  return (
    <>
      <div
        id="scroll-hide"
        className={` overflow-scroll border border-[#2c2a2a] ${classes}`}
      >
        <div className="flex justify-start items-start ">
          <div>
            <div className="flex text-start justify-start items-center w-fit text-black mx-auto py-1 border-b-[1px] border-[#bebbb8] bg-blue-100">
              {selected.length !== data.length ? (
                <TiTickOutline
                  onClick={() => {
                    setSelected(data);
                  }}
                  className="text-blue-400 text-[20px] mx-2 cursor-pointer"
                />
              ) : (
                <TiTick
                  onClick={() => {
                    setSelected([]);
                  }}
                  className="text-blue-400 text-[20px] mx-2 cursor-pointer"
                />
              )}
              {header.map((item: any, index: number) => {
                return (
                  <>
                    {!(
                      isChanging.status &&
                      isChanging.columnIndex === index &&
                      isChanging.header
                    ) ? (
                      <div
                        className={`dropdown ${
                          columnsHidden.includes(index) ? "hidden" : "block"
                        }`}
                        key={index}
                      >
                        <label
                          tabIndex={index}
                          className=" mx-2 w-[150px] block cursor-pointer overflow-hidden"
                        >
                          {item.length > 10 ? item.slice(0, 10) + "..." : item}
                        </label>
                        <FilterOpener
                          value={item}
                          index={index}
                          filterData={filterData}
                          clear={clear}
                          search={search}
                          filterType={filterType}
                          setFilterType={setFilterType}
                          hideColumn={hideColumn}
                          setSearch={setSearch}
                          isChanging={isChanging}
                          setIsChanging={setIsChanging}
                        />
                      </div>
                    ) : (
                      <input
                        key={index}
                        autoFocus
                        type="text"
                        className="w-[150px] mx-2 border-2 px-2 border-green-900 bg-transparent focus:outline-none"
                        defaultValue={item}
                        onChange={(e) =>
                          setIsChanging({
                            ...isChanging,
                            value: e.target.value,
                          })
                        }
                        onClick={changeHeaderCell}
                      />
                    )}
                  </>
                );
              })}
            </div>
            {data.map((item: any, rowIndex: number) => {
              let flag = selected.includes(item);
              return (
                <div
                  key={rowIndex}
                  className={`flex justify-start items-center my-[3px] h-[40px]  text-black mx-auto  border-b w-fit border-[#bebbb8] ${themeObj} ${
                    flag ? "bg-blue-200" : ""
                  }`}
                >
                  {!flag ? (
                    <TiTickOutline
                      className="text-blue-400 text-[20px] mx-2 cursor-pointer"
                      onClick={() => selectItem(item)}
                    />
                  ) : (
                    <TiTick
                      className="text-blue-400 text-[20px] mx-2 cursor-pointer"
                      onClick={() => selectItem(item)}
                    />
                  )}
                  {item.map((rowItem: any, valIndex: number) => {
                    return (
                      <>
                        {!(
                          isChanging.status &&
                          isChanging.columnIndex === valIndex &&
                          isChanging.rowIndex === rowIndex &&
                          !isChanging.header
                        ) ? (
                          <div
                            key={valIndex}
                            className={`w-[150px!important] text-start mx-2 overflow-hidden ${
                              columnsHidden.includes(valIndex)
                                ? "hidden"
                                : "block"
                            }`}
                            onClick={() => {
                              if (valIndex === 7) return;
                              setIsChanging({
                                status: true,
                                columnIndex: valIndex,
                                rowIndex: rowIndex,
                                header: false,
                                value: rowItem,
                              });
                            }}
                          >
                            {valIndex === 7 ? (
                              <a
                                href={rowItem}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500  p-2 underline-none bg-[#0330fc] text-white rounded-sm"
                              >
                                Link
                              </a>
                            ) : rowItem ? (
                              rowItem.length > 10 ? (
                                rowItem.slice(0, 10) + "..."
                              ) : (
                                rowItem
                              )
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          <input
                            key={valIndex}
                            type="text"
                            className="w-[150px] mx-2 border-2 px-2 border-green-900 bg-transparent focus:outline-none"
                            defaultValue={rowItem}
                            autoFocus
                            onChange={(e) =>
                              setIsChanging((prev: any) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            onClick={changeCell}
                          />
                        )}
                      </>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <HiddenColumns
            columnsHidden={columnsHidden}
            header={header}
            setColumnsHidden={setColumnsHidden}
          />
        </div>
      </div>
    </>
  );
}
