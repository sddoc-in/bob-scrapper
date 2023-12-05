import React from "react";
import HappyClientMainContextInterface, {
  FileDetails,
} from "../interface/Context";
import Loader from "../components/Loader";

export const MainContext = React.createContext<HappyClientMainContextInterface>(
  {} as HappyClientMainContextInterface
);

export interface allProductsInterface {
  product: string;
  page: number;
}

export default function ContextProvider({ children }: any) {
  const [theme, setTheme] = React.useState<string>("light");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [currentProduct, setCurrentProduct] = React.useState<string>("");
  const [allProducts, setAllProducts] = React.useState<allProductsInterface[]>(
    []
  );
  const [data, setData] = React.useState<any>([]);
  const [currentRequest, setCurrentRequest] = React.useState<number>(0);
  const [loopBreaker, setLoopBreaker] = React.useState<boolean>(false);
  const [state, setState] = React.useState<number>(0);
  const [maxState, setMaxState] = React.useState<number>(0);


  function CancelRequests(){
    // setLoopBreaker(true)
    // setLoading(false)
    // setCurrentRequest(0)
    // setState(1)
    // console.log("Cancel Request")
  }

  const themeObj = theme === "light" ? "light" : "dark";
  const oppositeObj = theme !== "light" ? "light" : "dark";

  return (
    <MainContext.Provider
      value={{
        theme,
        setTheme,
        loading,
        setLoading,
        themeObj,
        currentPage,
        setCurrentPage,
        currentProduct,
        setCurrentProduct,
        oppositeObj,
        allProducts,
        setAllProducts,
        currentRequest,
        setCurrentRequest,
        CancelRequests,
        loopBreaker,
        setLoopBreaker,
        state,
        setState,
        maxState,
        setMaxState,
      }}
    >
      {children}
      {loading && <Loader />}
    </MainContext.Provider>
  );
}
