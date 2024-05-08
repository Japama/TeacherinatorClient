import React from 'react';

function Footer() {
  return (
<footer className="bg-gray-500 dark:bg-[#393E46] w-full flex items-center justify-between flex-wrap fixed bottom-0 max-h-36 px-12 pb-4 pt-2">
  <div className="w-full text-white">
    <div className="md:flex justify-between items-start md:items-center text-center md:text-left">
      <div className="border rounded-lg px-4 py-2 mx-2 md:mx-4">
        <img src="https://cdn-icons-png.flaticon.com/512/888/888857.png" className="w-7 md:w-8" alt="" />
        <div className="text-left ml-3">
          <p className='text-xs text-gray-200'>Download on</p>
          <p className="text-sm md:text-base">Google Play Store</p>
        </div>
      </div>
      <h3 className="text-3xl mb-3">La mejor gestión del profesorado</h3>
      <p>Organización automatizada.</p>
      <div className="border rounded-lg px-4 py-2 mx-2 md:mx-4">
        <img src="https://cdn-icons-png.flaticon.com/512/888/888841.png" className="w-7 md:w-8" />
        <div className="text-left ml-3">
          <p className='text-xs text-gray-200'>Download on</p>
          <p className="text-sm md:text-base">Apple Store</p>
        </div>
      </div>
    </div>
    <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400 mt-4">
      <p>&copy; Teacherinator, 2024.</p>
      <div>
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