import React from 'react';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginator: React.FC<PaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumber = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="flex items-center justify-center">
        <li
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className={`px-4 py-2 border flex items-center cursor-pointer mx-1.5 ${
            currentPage === 1
              ? 'bg-gray-200 cursor-not-allowed'
              : 'hover:bg-[#f5f5f5]'
          }`}
        >
          <button className="text-sm" disabled={currentPage === 1}>
            &laquo;
          </button>
        </li>

        {pageNumber.map((page) => (
          <li
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 cursor-pointer mx-1.5 ${
              currentPage === page
                ? 'bg-gray-500 text-white'
                : 'hover:bg-[#f5f5f5] border'
            }`}
          >
            <button className="font-medium text-sm h-full w-full">
              {page}
            </button>
          </li>
        ))}

        <li
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          className={`px-4 py-2 border flex items-center cursor-pointer mx-1.5 ${
            currentPage === totalPages
              ? 'bg-gray-200 cursor-not-allowed'
              : 'hover:bg-[#f5f5f5]'
          }`}
        >
          <button
            className="font-medium text-sm h-full w-full"
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Paginator;
