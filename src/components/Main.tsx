import React from 'react'
import FileTaker from '../excel-component/FileTaker'
import { ExcelContext } from '../context/ExcelContext'
import ExcelComponent from '../excel-component/ExcelComponent'
import { MainContext } from '../context/Context'
import GetOrLoadData from '../excel-component/GetOrLoadData'

import { BsFiletypeCsv } from "react-icons/bs";
import { AiOutlineFileExcel } from "react-icons/ai";

export default function Main() {

    const { setTheme, theme, themeObj } = React.useContext(MainContext)
    const { downloadAsCsv, downloadAsExcel, setState, setFileData, setHeader } = React.useContext(ExcelContext)

    function changeTheme() {
        if (theme === 'light') {
            setTheme('dark')
        }
        else {
            setTheme('light')
        }
    }

    function newClicked (){
        setState(0)
        setFileData([])
        setHeader([])
    }


    const { state } = React.useContext(ExcelContext)
    return (
        <>
            <div className={`w-[100%] min-h-[100vh] flex justify-center items-center ${themeObj}`}>
                <div className='absolute top-1 left-1'>
                    <label className="swap swap-rotate">

                        <input type="checkbox" className="theme-controller" onClick={changeTheme} />

                        {/* sun icon */}
                        <svg className="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>

                        {/* moon icon */}
                        <svg className="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

                    </label>
                </div>
                {
                    state === 0 ?
                        <FileTaker />
                        :
                        <div style={{
                            overflow: 'hidden'
                        }}>
                            <div className="absolute right-0 top-2 flex items-center">
                                <p onClick={newClicked} className='py-2 px-3 bg-blue-500 text-white mx-2 rounded-[10px] cursor-pointer'>New</p>
                                <BsFiletypeCsv
                                    onClick={downloadAsCsv}
                                    className="text-[#000] text-[20px] mx-2 cursor-pointer"
                                />
                                <AiOutlineFileExcel
                                    onClick={downloadAsExcel}
                                    className="text-[#000] text-[20px] mx-2 cursor-pointer"
                                />
                            </div>
                            <GetOrLoadData />
                            <div className='my-1'></div>
                            <ExcelComponent />
                        </div>
                }
            </div >
        </>

    )
}
