import { ChangeEvent, useState } from 'react';

interface usePaginationProps<Tdata> {
  itemsPerPage?: number;
  data: Tdata[];
  startFrom: number;
}

interface PaginationProps {
  id: number;
  current: boolean;
  ellipsis: boolean;
}

interface UsePaginationReturn<Tdata> {
  slicedData: Tdata[];
  pagination: [] | PaginationProps[];
  prevPage: (e: ChangeEvent) => void;
  nextPage: (e: ChangeEvent) => void;
  changePage: (page: number, e: ChangeEvent) => void;
}

const usePagination = <Tdata>({
  itemsPerPage,
  data,
  startFrom,
}: usePaginationProps<Tdata>): UsePaginationReturn<Tdata> => {
  const perPage = itemsPerPage || 10;
  const pages = Math.ceil(data.length / perPage);
  const pagination: PaginationProps[] = [];
  const [currentPage, setCurrentPage] = useState(
    startFrom <= pages ? startFrom : 1,
  );
  const [slicedData, setSliceData] = useState(
    [...data].slice((currentPage - 1) * perPage, currentPage * perPage),
  );

  const pushPage = (
    page: number,
    current: boolean,
    ellipsis: boolean,
  ): number => pagination.push({ id: page, current, ellipsis });

  let ellipsisLeft = false;
  let ellipsisRight = false;

  // eslint-disable-next-line no-plusplus
  Array.from({ length: pages }, (v: unknown, k: number) => k + 1).forEach(
    (page: number) => {
      if (page === currentPage) {
        pushPage(page, true, false);
      } else if (
        page < 2 ||
        page > pages - 1 ||
        page === currentPage - 1 ||
        page === currentPage + 1
      ) {
        pushPage(page, false, false);
      } else if (page > 1 && page < currentPage && !ellipsisLeft) {
        pushPage(page, false, true);
        ellipsisLeft = true;
      } else if (page < pages || (page > currentPage && !ellipsisRight)) {
        pushPage(page, false, true);
        ellipsisRight = true;
      }
    },
  );

  const changePage = (page: number, e: ChangeEvent): void => {
    e.preventDefault();
    if (page !== currentPage) {
      setCurrentPage(page);
      setSliceData([...data].slice((page - 1) * perPage, page * perPage));
    }
  };

  const goToPrev = (e: ChangeEvent): void => {
    e.preventDefault();
    setCurrentPage((prevValue: number) =>
      prevValue - 1 === 0 ? prevValue : prevValue - 1,
    );
    if (currentPage !== 1) {
      setSliceData(
        [...data].slice(
          (currentPage - 2) * perPage,
          (currentPage - 1) * perPage,
        ),
      );
    }
  };

  const gotToNext = (e: ChangeEvent): void => {
    e.preventDefault();
    setCurrentPage((prevValue: number) =>
      prevValue === pages ? prevValue : prevValue + 1,
    );
    if (currentPage !== pages) {
      setSliceData(
        [...data].slice(currentPage * perPage, (currentPage + 1) * perPage),
      );
    }
  };

  return {
    slicedData,
    pagination,
    prevPage: goToPrev,
    nextPage: gotToNext,
    changePage,
  };
};

export default usePagination;
