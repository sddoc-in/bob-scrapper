import React from 'react'
import FileTaker from '../excel-component/FileTaker'
import { ExcelContext } from '../context/ExcelContext'
import ExcelComponent from '../excel-component/ExcelComponent'

export default function Main() {
    const { state } = React.useContext(ExcelContext)
    return (
        <>
            {
                state === 0 ? (
                    <div className='w-[100%] h-[100vh]'>
                        <FileTaker />
                    </div>
                )
                    : <ExcelComponent />
            }
        </>

    )
}