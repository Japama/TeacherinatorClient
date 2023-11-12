import React from 'react';

function Footer() {
  return (
      <footer className="bg-gray-900 w-full pt-4 flex items-center justify-between flex-wrap">
        <div className="mx-auto text-white">
          <div className="text-center">
            <h3 className="text-3xl mb-3"> Download our fitness app </h3>
            <p> Stay fit. All day, every day. </p>
            <div className="flex justify-center my-10">
              <div className="flex items-center border w-auto rounded-lg px-4 py-2 mx-2">
                <img src="https://cdn-icons-png.flaticon.com/512/888/888857.png" className="w-7 md:w-8" alt=""/>
                  <div className="text-left ml-3">
                    <p className='text-xs text-gray-200'>Download on </p>
                    <p className="text-sm md:text-base"> Google Play Store </p>
                  </div>
              </div>
              <div className="flex items-center border w-auto rounded-lg px-4 py-2 mx-2">
                <img src="https://cdn-icons-png.flaticon.com/512/888/888841.png" className="w-7 md:w-8"/>
                  <div className="text-left ml-3">
                    <p className='text-xs text-gray-200'>Download on </p>
                    <p className="text-sm md:text-base"> Apple Store </p>
                  </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
            <p className="order-2 md:order-1 mt-8 md:mt-0"> &copy; Beautiful Footer, 2021. </p>
            <div className="order-1 md:order-2">
              <span className="px-2">About us</span>
              <span className="px-2 border-l">Contact us</span>
              <span className="px-2 border-l">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
//   <footer className=" flex bg-gray-900 text-white p-4 h-20 fixed w-full bottom-0 z-10">
//   <div className="container mx-auto flex justify-between items-center">
//     <div>
//       <p>&copy; 2023 Sports Guide</p>
//     </div>
//     <div>
//       <ul className="flex space-x-4">
//         <li>
//           <a href="#" className="hover:text-gray-400">Inicio</a>
//         </li>
//         <li>
//           <a href="#" className="hover:text-gray-400">Acerca de nosotros</a>
//         </li>
//         <li>
//           <a href="#" className="hover:text-gray-400">Contacto</a>
//         </li>
//       </ul>
//     </div>
//   </div>
// </footer>
  );
}

export default Footer;