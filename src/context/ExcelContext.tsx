import React from "react";
import ExcelContextInterface from "../interface/ExcelContext";
import axios from "axios";
import { MainContext } from "./Context";

//@ts-ignore
import * as XLSX from "xlsx";
//@ts-ignore
import  Papa  from "papaparse";

export const ExcelContext = React.createContext<ExcelContextInterface>(
  {} as ExcelContextInterface
);

export default function ExcelProvider({ children }: any) {

  const {setLoading} = React.useContext(MainContext);

  const [state, setState] = React.useState<number>(0);
  const [url, setUrl] = React.useState<string>("");

  const [fileData, setFileData] = React.useState<any>({});
  const [header, setHeader] = React.useState<any>({});
  const [selected, setSelected] = React.useState<any>([]);
  const [columnsHidden, setColumnsHidden] = React.useState<number[]>([]);

  function getCSVFileData(file: any) {
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        const rowsArray:any = [];
        const valuesArray:any = [];
        results.data.map((d: any) => {
          rowsArray.push(Object.keys(d));
          Object.values
          valuesArray.push(Object.values(d));
          return null
        });
        setHeader(rowsArray[0]);
        setFileData(valuesArray);
        setState(1);
        setLoading(false);
      },
    });
  }

  async function getOnlineCSVData(file: any) {
    setLoading(true);
    let { data } = await axios.post("/api/files/file-data-csv", { file: file });
    data = data.response;
    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        const rowsArray:any = [];
        const valuesArray:any = [];
        results.data.map((d: any) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
          return null
        });
        setHeader(rowsArray[0]);
        setFileData(valuesArray);
        setState(1);
        setLoading(false);
      },
    });
  }

  async function getOnlineExcelData(file: any) {
    setLoading(true);
    let { data } = await axios.post("/api/files/file-data-excel", {
      file: file,
    });
    data = data.response;
    setHeader(data[0]);
    setFileData(data.slice(1, data.length));
    setState(1);
    setLoading(false);
  }

  function getExcelFileData(file: any) {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      setHeader(data[0]);
      setFileData(data.slice(1, data.length));
      setState(1);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  }

  function s2ab(s: any) {
    // converting string to array buffer
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  function fileChoser(file: any) {
    if (file.type === "text/csv") {
      getCSVFileData(file);
    } else if (
         file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      || file.type === "application/vnd.ms-excel"
      || file.type === "application/vnd.ms-excel.sheet.macroEnabled.12"
      || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.template"
      || file.type === "application/vnd.ms-excel.template.macroEnabled.12"
      || file.type === "application/vnd.ms-excel.addin.macroEnabled.12"
      || file.type === "application/vnd.ms-excel.sheet.binary.macroEnabled.12"
      || file.type === "application/vnd.oasis.opendocument.spreadsheet"
      || file.type === "application/x-vnd.oasis.opendocument.spreadsheet-template"
      || file.type === "application/vnd.oasis.opendocument.spreadsheet-template"
    ) {
      getExcelFileData(file);
    } else {
      alert("Only CSV and Excel files are allowed");
    }
  }

  function onlineFileChoser(file: any) {
    const filetype = file.name.split(".")[1];
    if (filetype === "csv") {
      getOnlineCSVData(file);
    } else if (filetype === "xlsx" || filetype === "xls") {
      getOnlineExcelData(file);
    }
  }

  function downloadAsExcel() {
    setLoading(true);
    let data = selected.map((item: any) => {
      item = item.map((item: any, idx: number) => {
        if (columnsHidden.includes(idx)) return null;
        return item;
      });
      return item;
    });

    const dummyHeader = header.map((item: any, idx: number) => {
      if (columnsHidden.includes(idx)) return null;
      return item;
    });
    data.unshift(dummyHeader);

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "selected.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  }

  function downloadAsCsv() {
    setLoading(true);
    const data = selected.map((item: any) => {
      item = item.map((item: any, idx: number) => {
        if (columnsHidden.includes(idx)) return null;
        return item;
      });
      return item.join(",");
    });
    const dummyHeader = header.map((item: any, idx: number) => {
      if (columnsHidden.includes(idx)) return null;
      return item;
    });
    data.unshift(dummyHeader.join(","));
    const csv = data.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "selected.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  }

  return (
    <ExcelContext.Provider
      value={{
        state,
        setState,
        fileChoser,
        fileData,
        setFileData,
        header,
        setHeader,
        selected,
        setSelected,
        downloadAsExcel,
        downloadAsCsv,
        columnsHidden,
        setColumnsHidden,
        onlineFileChoser,
        url,
        setUrl,
      }}
    >
      {children}
    </ExcelContext.Provider>
  );
}
