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

    const lightTheme = {
        background: '#fff!important',
        color: '#000!important'
    }
    const darkTheme = {
        background: '#000!important',
        color: '#fff!important'
    }

    const themeObj = theme === 'light' ? lightTheme : darkTheme;
    const oppositeObj = theme !== 'light' ? lightTheme : darkTheme;


    return (
        <MainContext.Provider value={{
            theme, setTheme, lightTheme, darkTheme, loading, setLoading, themeObj,
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
