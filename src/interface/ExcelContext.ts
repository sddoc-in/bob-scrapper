interface ExcelContextInterface {
    state: number;
    setState: React.Dispatch<React.SetStateAction<number>>;
    fileChoser: (e: any) => void;
    onlineFileChoser: (file: any) => void;
    fileData: any;
    setFileData: React.Dispatch<React.SetStateAction<any>>;
    header: any;
    setHeader: React.Dispatch<React.SetStateAction<any>>;
    selected: any[];
    setSelected: React.Dispatch<React.SetStateAction<any[]>>;
    downloadAsExcel: () => void;
    downloadAsCsv: () => void;
    columnsHidden: number[];
    setColumnsHidden: React.Dispatch<React.SetStateAction<number[]>>;
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
}

export default ExcelContextInterface;