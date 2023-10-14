import React from "react";

const PdfRenderer = () => {
  return (
    <div className="bg-white w-full flex flex-col items-center rounded-md shadow">
      <div className="h-14 w-full flex items-center justify-between px-2 border-b border-zinc-200">
        <div className="flex items-center gap-1.5">Top Bar</div>

        <div>Button</div>
      </div>

      <div>Body</div>
    </div>
  );
};

export default PdfRenderer;
