import React from "react";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-start px-36 w-full">
      <div className="flex w-full md:w-[600px] md:py-10">
        {children}
      </div>
    </div>
  )
};