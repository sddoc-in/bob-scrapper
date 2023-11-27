import React from 'react'
import HappyClientMainContextInterface, { FileDetails } from '../interface/Context'
import Loader from '../components/Loader'

export const MainContext = React.createContext<HappyClientMainContextInterface>({} as HappyClientMainContextInterface)

export default function ContextProvider({ children }: any) {

    const [theme, setTheme] = React.useState<string>('light')
    const [loading, setLoading] = React.useState<boolean>(false)
    const [currentPage, setCurrentPage] = React.useState<number>(1)
    const [currentProduct, setCurrentProduct] = React.useState<string>('')
    const [data, setData] = React.useState<any>([])

    const lightTheme = {
        background: '#fff',
        color: '#000'
    }
    const darkTheme = {
        background: '#000',
        color: '#fff'
    }


    return (
        <MainContext.Provider value={{ 
            theme,setTheme,lightTheme,darkTheme,loading,setLoading,
        currentPage,setCurrentPage,currentProduct,setCurrentProduct
         }}>
            {children}
         {
            loading && <Loader />
         }
        </MainContext.Provider>
    )
}
