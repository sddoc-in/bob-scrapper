import React from "react";
import { ExcelContext } from "../context/ExcelContext";
import { MainContext } from "../context/Context";
import GetNumberOfPartners from "../constant/GetPartener";
// import cheerio from 'cheerio';
import { BASE_API_URL } from "../constant/data";

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
      const maxPages = 4;
      const retryAttempts = 3; // Number of retry attempts 
      var reqdata = [];
      for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
        let retryCount = 0;
        let success = false;
        while (retryCount < retryAttempts && !success) {
        let response = await fetch(`${BASE_API_URL}?` + new URLSearchParams({
          page: currentPage.toString(),
          querry: currentProduct
        }), {
          method: "GET",
        }) ;
        
        const responsedata = await response.json();
        if (responsedata?.length) {
          reqdata = [...reqdata, ...responsedata];
          // reqdata.push(responsedata);
          success = true; // Set success flag to true
        } else {
          retryCount++;
        }
      }

        
    }


      // let response = await fetch(`${BASE_API_URL}?` + new URLSearchParams({
      //   page: currentPage.toString(),
      //   querry: currentProduct
      // }), {
      //   method: "GET",
      // });
      // var reqdata = await response.json();

      if (reqdata.length === 0) {
        alert("No Data Found")
        return
      }
      else {
        setLoading(false);
        console.log(reqdata)
        setCurrentPage(currentPage + 1);
        setHeader(Object.keys(reqdata[0]))
        let tempdata = []
        for (let i = 0; i < reqdata.length; i++) {
          tempdata.push(Object.values(reqdata[i]))
        }
        setFileData(tempdata)
        setAllProducts([...allProducts, { product: currentProduct, page: currentPage }])
        setState(1)


        var data=[]
        const retryAttempts = 3; // Number of retry attempts 
        const corsProxy = 'https://corsproxy.io/?';
        for (let i = 0; i < reqdata.length; i++) {
          let retryCount = 0;
          let success = false;
          while (retryCount < retryAttempts && !success){
          
          try {

          const response = await fetch(corsProxy + encodeURIComponent( reqdata[i]['product Url']));

          const html = await response.text();
          const numOfPartners = GetNumberOfPartners(html)
          console.log(numOfPartners)
          success = true;
          data.push({ ...reqdata[i], 'Partners': numOfPartners })
          reqdata[i].id = i + 1
            
          } catch  {
            console.log(retryCount,'anohther proxy retrying for cors eror fixing......')
            retryCount++;
            
          }
          

          }
        }

        
      
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

    // setLoading( false);
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
