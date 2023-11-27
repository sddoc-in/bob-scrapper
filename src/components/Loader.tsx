import React, { CSSProperties } from 'react'
import ClockLoader from "react-spinners/ClockLoader";

const override: CSSProperties = {
  display: "block",
  margin: '0 auto',
  borderColor: "#ffd416",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)"
}
export default function Loader() {
  return (
    <div className='w-[100%] h-[100vh] bg-[#000000] bg-opacity-50 z-50 fixed top-0 left-0'>
      <div className='w-[100%] h-[100vh] flex justify-center items-center'>
        <ClockLoader color={'#FFA736'} cssOverride={override} size={60} />
      </div>
    </div>
  );
}
