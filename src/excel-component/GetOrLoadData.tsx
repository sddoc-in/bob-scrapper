import React from 'react'
import { MainContext } from '../context/Context'
import { ExcelContext } from '../context/ExcelContext'
import {
    IoIosArrowDropdownCircle,
    IoIosArrowDropupCircle,
} from "react-icons/io";


export default function GetOrLoadData() {
    const { allProducts, setAllProducts, setCurrentProduct, setCurrentPage, themeObj, oppositeObj, setLoading } = React.useContext(MainContext)
    const { fileData, setFileData } = React.useContext(ExcelContext)
    const [selectedProduct, setSelectedProduct] = React.useState<any>({})
    const [newProduct, setNewProduct] = React.useState<string>('')

    const [selectOpen, setSelectOpen] = React.useState<any>({
        open: false,
        data: allProducts,
    });

    function channgeProduct(e: any) {
        setNewProduct(e.target.value)
        setSelectOpen({ ...selectOpen, open: false })
        setSelectedProduct({ })
    }

    async function loadMoreData() {
        if(!selectedProduct.product && !newProduct){
            alert("Please Select or Enter Product to load")
            return
        }
        let currentProduct = selectedProduct.product ? selectedProduct.product : newProduct
        let currentPage = selectedProduct.page ? selectedProduct.page+1 : 1


        setLoading(true);
        let responses = await fetch("https://bob.sddoc.in/getdata?" + new URLSearchParams({
                page: currentPage,
                querry: currentProduct,
            }), {
                method: "GET",
            });
        let data = await responses.json();
        if (data.length === 0) {
            alert("No Data Found")
            return
        }
        else {
            let temp = fileData
            for (let i = 0; i < data.length; i++) {
                temp.push(Object.values(data[i]))
            }

            setFileData(temp)
            console.log(temp)
            setAllProducts([...allProducts, { product: currentProduct, page: currentPage}])
            setSelectedProduct({ product: currentProduct, page: currentPage})
            setCurrentProduct(currentProduct)
            setCurrentPage(currentPage)
        }
        setLoading(false);
    }

    return (
        <div className='flex justify-center items-center flex-col my-4' style={themeObj}>


            <div
                onClick={() =>
                    setSelectOpen({ ...selectOpen, open: !selectOpen.open })
                }
                className="flex justify-between cursor-pointer mt-3  pl-2 items-center  w-full max-w-xs "
            >
                <input defaultValue={selectedProduct.product} placeholder="Select or Enter product" type="text" className="file-input my-3 file-input-bordered file-input-secondary shadow-lg w-full max-w-xs text-white pl-3" style={oppositeObj} onChange={channgeProduct} />

                {selectOpen.open ? (
                    <IoIosArrowDropupCircle className="text-[30px] text-black cursor-pointer" />
                ) : (
                    <IoIosArrowDropdownCircle className="text-[30px] text-black cursor-pointer" />
                )}
            </div>
            {selectOpen.open && (
                <div className="w-full max-w-xs mt-1 mb-3 text-start max-h-[400px] bg-white shadow-lg">
                    {selectOpen.data.length > 0 ? (
                        selectOpen.data.map((item: any, idx: number) => (
                            <p
                                key={idx}
                                onClick={() => {
                                    setSelectedProduct(item)
                                    setSelectOpen({ ...selectOpen, open: false });
                                }}
                                className="text-black text-[18px] py-2 pl-2 cursor-pointer"
                            >
                                {item.product}
                            </p>
                        ))
                    ) : (
                        <p className="text-black text-[18px] py-2 pl-2 cursor-pointer">
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
                    Load More
                </button>
            </div>

        </div>
    )
}
