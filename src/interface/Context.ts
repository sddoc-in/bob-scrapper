export interface FileDetails {
    filename: string,
    lastModifiedTime: number,
    buffer: ArrayBuffer | null,
    size: number,
    data?: object[] | null
}



export default interface HappyClientMainContextInterface {
    theme: string,
    setTheme: React.Dispatch<React.SetStateAction<string>>,
    themeObj: string,
    oppositeObj: string,
    allProducts: object[],
    setAllProducts: React.Dispatch<React.SetStateAction<object[]>>,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    currentProduct: string,
    setCurrentProduct: React.Dispatch<React.SetStateAction<string>>,
    currentRequest:number,
    setCurrentRequest:React.Dispatch<React.SetStateAction<number>>,
    CancelRequests:()=>void,
    loopBreaker:boolean,
    setLoopBreaker:React.Dispatch<React.SetStateAction<boolean>>,
    state:number,
    setState:React.Dispatch<React.SetStateAction<number>>,
    maxState:number,
    setMaxState:React.Dispatch<React.SetStateAction<number>>,
}


