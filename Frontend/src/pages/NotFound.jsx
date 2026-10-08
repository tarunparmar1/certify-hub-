import React from 'react';

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center  px-4">
      <div className="w-full max-w-xl   border border-black p-8 text-center ">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#FBBF24] text-3xl font-black text-white ">
          404
        </div>

        <h1 className="text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
          Oops! Page not found
        </h1>

        <p className="mt-4 text-base text-[#374151] sm:text-lg">
          The page you are looking for may have been moved, deleted, or never existed.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <link
            to="/"
            className="inline-flex items-center justify-center bg-[#FBBF24] rounded-full  px-6 py-3 text-sm font-semibold text-white  hover:bg-[#1f2937]"
          >
            Back to Home
          </link>


        </div>
      </div>
    </div>
  );
}

export default NotFound;