import React from "react";
import { ExcelContext } from "../context/ExcelContext";
import { MainContext } from "../context/Context";
import axios from "axios";

export default function FileTaker() {


  const { setHeader, setFileData, setState,fileChoser } = React.useContext(ExcelContext);


  const { setLoading, setCurrentProduct,allProducts, setAllProducts, currentProduct, currentPage, setCurrentPage, themeObj, oppositeObj } = React.useContext(MainContext);

  const getQueryData = React.useRef(() => { });

  getQueryData.current = async () => {
    try {
      if (!currentProduct) {
        alert("Enter Product");
        return;
      }
      setLoading(true);
      let response = await fetch("https://bob.sddoc.in/getdata?" + new URLSearchParams({
        page: currentPage.toString(),
        querry: currentProduct
      }), {
        method: "GET",
      });
      let data = await response.json();
      if (data.length === 0) {
        alert("No Data Found")
        return
      }
      else {
        setCurrentPage(currentPage + 1);
        setHeader(Object.keys(data[0]))
        let temp = []
        for (let i = 0; i < data.length; i++) {
          temp.push(Object.values(data[i]))
        }
        setFileData(temp)
        setAllProducts([...allProducts, { product: currentProduct, page: currentPage }])
        setState(1)

      }
    }
    catch (e) {
      console.log(e)
      alert("Something went wrong")
    }

    setLoading(false);
  };

  function checkFileTypes(file: string) {
    const types = [
      "application/vnd.ms-excel",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/vnd.oasis.opendocument.spreadsheet-template",
      "application/vnd.ms-excel.template.macroEnabled.12",
      "application/vnd.ms-excel.addin.macroEnabled.12",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12",

    ];
    if (types.includes(file)) {
      return true;
    }
  }
  function getFile(e: any) {
    const file = e.target.files[0];
    if (!checkFileTypes(file.type)) {
      alert("Only Excel and csv files are allowed");
      return;
    }
    fileChoser(file)
  }

  return (
    <>
      <div className="w-11/12 md:w-10/12 mx-auto flex-col flex justify-center items-center">

        <input type="text" className="file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white pl-3" placeholder="Enter Product" style={oppositeObj} onChange={(e) => setCurrentProduct(e.target.value)} />

        <div className="flex justify-center items-center">
          <button
            className="btn btn-primary btn-active-shadow my-1 px-3 py-2 h-[auto] w-[auto] min-h-[auto] min-w-[auto"
            onClick={getQueryData.current}
          >
            Search
          </button>
        </div>

        <div className="divider w-full" style={themeObj}>OR</div>
        <input
          type="file"
          className="file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white" style={oppositeObj}
          onChange={(e) => getFile(e)}
        />
      </div>
    </>
  );
}
