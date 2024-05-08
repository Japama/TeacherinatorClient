import React, { ChangeEvent } from 'react';

interface PaginationProps {
    itemsPerPage: number;
    handleItemsPerPageChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    currentPage: number;
    handlePagination: (page: number) => void;
    endPage: number;
    startPage: number;
    totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, handleItemsPerPageChange, currentPage, handlePagination, endPage, startPage, totalPages }) => {
    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {[5, 10, 20, 50, 0].map((value, index) => (
                        <option key={index} value={value}>
                            {value === 0 ? "Todos" : value}
                        </option>
                    ))}
                </select>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => handlePagination(1)}
                        disabled={currentPage === 1 || itemsPerPage === 0}
                        className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${currentPage === 1 && "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Primera
                    </button>
                    <button
                        onClick={() => handlePagination(currentPage - 1)}
                        disabled={currentPage === 1 || itemsPerPage === 0}
                        className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${currentPage === 1 && "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Anterior
                    </button>
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePagination(page)}
                            className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${currentPage === page && "bg-blue-700"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePagination(currentPage + 1)}
                        disabled={currentPage === totalPages || itemsPerPage === 0}
                        className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${(currentPage === totalPages || itemsPerPage === 0) && "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Siguiente
                    </button>
                    <button
                        onClick={() => handlePagination(totalPages)}
                        disabled={currentPage === totalPages || itemsPerPage === 0}
                        className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none ${(currentPage === totalPages || itemsPerPage === 0) && "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Última
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Pagination;