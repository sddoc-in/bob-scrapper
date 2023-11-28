import React from "react";

export function HiddenColumns({
  columnsHidden,
  header,
  setColumnsHidden,
}: {
  columnsHidden: number[];
  header: any;
  setColumnsHidden: any;
}) {
  function showColumn(name: string) {
    const index = header.indexOf(name);
    setColumnsHidden(columnsHidden.filter((i: any) => i !== index));
  }
  return (
    <>
      <div>
        <div className="w-fit text-black mx-auto py-1 border-b-[1px] border-[#bebbb8] bg-blue-100">
          <p className="text-start  mx-2 w-[100px] block cursor-pointer">Hidden</p>
        </div>

        {/* hidden columns */}
        {columnsHidden.length > 0
          ? columnsHidden.map((item: any, index: number) => {
              return (
                <div key={index} onClick={()=>showColumn(header[item])} className="w-[100px!important] block px-2 text-blue-600 hover:underline cursor-pointer   border-b  border-[#bebbb8]">
                  {header[item].length > 10
                    ? header[item].slice(0, 10) + "..."
                    : header[item]}
                </div>
              );
            })
          : null}
      </div>
    </>
  );
}
