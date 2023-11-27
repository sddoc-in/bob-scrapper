import React from 'react'
import ContextProvider from './context/Context'
import ExcelProvider from './context/ExcelContext';
import Main from './components/Main';



export default function App() {
  return (
    <>
      <ContextProvider>
        <ExcelProvider>
         <Main />
        </ExcelProvider>
      </ContextProvider>
    </>
  );
}


