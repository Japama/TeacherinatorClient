import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-500 dark:bg-[#393E46] w-full pt-4 flex items-center justify-between flex-wrap">
      <div className="mx-auto text-white">
        <div className="text-center">
          <h3 className="text-3xl mb-3"> La mejor gestión del profesorado </h3>
          <p> Organización automatizada. </p>
          <div className="flex justify-center my-10">
            <div className="flex items-center border w-auto rounded-lg px-4 py-2 mx-2">
              <img src="https://cdn-icons-png.flaticon.com/512/888/888857.png" className="w-7 md:w-8" alt="" />
              <div className="text-left ml-3">
                <p className='text-xs text-gray-200'>Download on </p>
                <p className="text-sm md:text-base"> Google Play Store </p>
              </div>
            </div>
            <div className="flex items-center border w-auto rounded-lg px-4 py-2 mx-2">
              <img src="https://cdn-icons-png.flaticon.com/512/888/888841.png" className="w-7 md:w-8" />
              <div className="text-left ml-3">
                <p className='text-xs text-gray-200'>Download on </p>
                <p className="text-sm md:text-base"> Apple Store </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
          <p className="order-2 md:order-1 mt-8 md:mt-0"> &copy; Teacherinator, 2024. </p>
          <div className="order-1 md:order-2">
            <span className="px-2">About us</span>
            <span className="px-2 border-l">Contact us</span>
            <span className="px-2 border-l">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>

  );
}

export default Footer;