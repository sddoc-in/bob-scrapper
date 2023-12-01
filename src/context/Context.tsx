import React from 'react'
import HappyClientMainContextInterface, { FileDetails } from '../interface/Context'
import Loader from '../components/Loader'

export const MainContext = React.createContext<HappyClientMainContextInterface>({} as HappyClientMainContextInterface)

export interface allProductsInterface {
    product: string,
    page: number
}

export default function ContextProvider({ children }: any) {

    const [theme, setTheme] = React.useState<string>('light')
    const [loading, setLoading] = React.useState<boolean>(false)
    const [currentPage, setCurrentPage] = React.useState<number>(1)
    const [currentProduct, setCurrentProduct] = React.useState<string>('')
    const [allProducts, setAllProducts] = React.useState<allProductsInterface[]>([])
    const [data, setData] = React.useState<any>([])

    
    const themeObj = theme === 'light' ? 'light' : 'dark';
    const oppositeObj = theme !== 'light' ? 'light' : 'dark';


    return (
        <MainContext.Provider value={{
            theme, setTheme,  loading, setLoading, themeObj,
            currentPage, setCurrentPage, currentProduct, setCurrentProduct, oppositeObj,
            allProducts, setAllProducts, 
        }}>
            {children}
            {
                loading && <Loader />
            }
        </MainContext.Provider>
    )
}
