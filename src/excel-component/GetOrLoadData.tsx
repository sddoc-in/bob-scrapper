import React from 'react'
import { MainContext } from '../context/Context'
import { ExcelContext } from '../context/ExcelContext'
import {
    IoIosArrowDropdownCircle,
    IoIosArrowDropupCircle,
} from "react-icons/io";
import { BASE_API_URL } from '../constant/data';
import GetNumberOfPartners from './GetPartner';


export default function GetOrLoadData() {
    const { allProducts, setAllProducts, setCurrentProduct, setCurrentPage, themeObj, oppositeObj, setLoading } = React.useContext(MainContext)
    const { fileData, setFileData } = React.useContext(ExcelContext)
    const [selectedProduct, setSelectedProduct] = React.useState<any>({})
    const [newProduct, setNewProduct] = React.useState<string>('')

    const [selectOpen, setSelectOpen] = React.useState<any>({
        open: false,
    });

    function channgeProduct(e: any) {
        setNewProduct(e.target.value)
        setSelectOpen({ ...selectOpen, open: false })
        setSelectedProduct({})
    }

    async function loadMoreData() {
        if (!selectedProduct.product && !newProduct) {
            alert("Please Select or Enter Product to load")
            return
        }
        let currentProduct = selectedProduct.product ? selectedProduct.product : newProduct
        let currentPage = selectedProduct.page ? selectedProduct.page + 1 : 1

        let temp: any = []
        if (fileData.length > 0) {
            temp = fileData
        }

        let i = 0

        setLoading(true);
        try {

            for (i = 0; i < 4; i++) {
                let response = await fetch(BASE_API_URL + new URLSearchParams({
                    page: (currentPage + i).toString(),
                    querry: currentProduct
                }), {
                    method: "GET",
                    headers: {
                        "Access-Control-Allow-Methods": '*',
                        "Access-Control-Allow-Headers": '*',
                        "Access-Control-Allow-Origin": '*',
                    },
                });
                let data = await response.json();
                if (data.length === 0) {
                    // alert("No Data Found")
                    //return
                }
                else {
                    for (let j = 0; j < data.length; j++) {
                        let tempObj: any = Object.values(data[j])
                        let partner = await GetNumberOfPartners(tempObj[7])
                        tempObj.push(partner)
                        temp.push(tempObj)
                    }
                }
            }

            let newProductList = allProducts
            let currentProductList = allProducts.filter((item: any) => item.product === currentProduct)
            if (currentProductList.length > 0) {
                newProductList = allProducts.map((item: any) => {
                    if (item.product === currentProduct) {
                        item.page = currentPage + i
                    }
                    return item
                })
            }

            setFileData(temp)
            setAllProducts(newProductList)
            setSelectOpen({ open: false })
            setSelectedProduct({ product: currentProduct, page: currentPage + i })
            setCurrentProduct(currentProduct)
            setCurrentPage(currentPage + i)

        }
        catch (e) {
            console.log(e)
            alert("Something went wrong")
        }

        setLoading(false);
    }

    return (
        <div className='flex justify-center items-center flex-col my-4'>


            <div
                onClick={() =>
                    setSelectOpen({ ...selectOpen, open: !selectOpen.open })
                }
                className="flex justify-between cursor-pointer mt-3  pl-2 items-center  w-full max-w-xs "
            >
                <input defaultValue={selectedProduct.product} placeholder="Select or Enter product" type="text" className={`file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white pl-3 ${oppositeObj}`} onChange={channgeProduct} />

                {selectOpen.open ? (
                    <IoIosArrowDropupCircle className={`text-[30px] text-black cursor-pointer ${themeObj}`} />
                ) : (
                    <IoIosArrowDropdownCircle className={`text-[30px] text-black cursor-pointer ${themeObj}`} />
                )}
            </div>
            {selectOpen.open && (
                <div className="w-full max-w-xs mt-1 mb-3 text-start max-h-[400px] bg-white shadow-lg">
                    {allProducts.length > 0 ? (
                        allProducts.map((item: any, idx: number) => (
                            <p
                                key={idx}
                                onClick={() => {
                                    setSelectedProduct(item)
                                    setSelectOpen({ open: false });
                                }}
                                className={`text-black text-[18px] py-2 pl-2 cursor-pointer ${oppositeObj}`}
                            >
                                {item.product}
                            </p>
                        ))
                    ) : (
                        <p className={`text-black text-[18px] py-2 pl-2 cursor-pointer ${oppositeObj}`}>
                            No Products selected yet.
                        </p>
                    )}
                </div>
            )}


            <div className="flex justify-center items-center">
                <button
                    className="btn btn-primary btn-active-shadow my-1 px-3 py-2 h-[auto] w-[auto] min-h-[auto] min-w-[auto"
                    onClick={loadMoreData}
                >
                     Load More Pages
                </button>
            </div>

        </div>
    )
}
