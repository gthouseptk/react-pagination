import { useState, useEffect } from 'react';

export interface usePaginationProps<Tdata> {
  itemsPerPage?: number;
  data: Tdata[];
  startFrom: number;
}

export interface PaginationProps {
  id: number;
  current: boolean;
  ellipsis: boolean;
}

export interface UsePaginationReturn<Tdata> {
  slicedData: Tdata[];
  pagination: PaginationProps[];
  prevPage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  nextPage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  changePage: (
    page: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  setFilteredData: React.Dispatch<React.SetStateAction<Tdata[]>>;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
  filteredData: Tdata[];
}

export const usePagination = <Tdata>({
  itemsPerPage,
  data,
  startFrom,
}: usePaginationProps<Tdata>): UsePaginationReturn<Tdata> => {
  const perPage = itemsPerPage || 10;
  const [searching, setSearching] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const pages = Math.ceil(filteredData.length / perPage);
  const pagination: PaginationProps[] = [];
  const [currentPage, setCurrentPage] = useState(
    startFrom <= pages ? startFrom : 1,
  );
  const [slicedData, setSliceData] = useState(
    [...filteredData].slice((currentPage - 1) * perPage, currentPage * perPage),
  );

  useEffect(() => {
    setSliceData(
      [...filteredData].slice(
        (currentPage - 1) * perPage,
        currentPage * perPage,
      ),
    );
    if (searching) {
      setCurrentPage(1);
      setSearching(false);
    }
  }, [filteredData, currentPage, searching, perPage]);

  const pushPage = (id: number, current: boolean, ellipsis: boolean): number =>
    pagination.push({ id, current, ellipsis });

  let ellipsisLeft = false;
  let ellipsisRight = false;

  Array.from({ length: pages }, (v: unknown, k: number) => k + 1).forEach(
    (page: number) => {
      if (page === currentPage) return pushPage(page, true, false);
      if (
        page < 2 ||
        page > pages - 1 ||
        page === currentPage - 1 ||
        page === currentPage + 1
      )
        return pushPage(page, false, false);
      if (page > 1 && page < currentPage && !ellipsisLeft) {
        ellipsisLeft = true;
        return pushPage(page, false, true);
      }
      if (page < pages && page > currentPage && !ellipsisRight) {
        ellipsisRight = true;
        return pushPage(page, false, true);
      }
    },
  );

  const changePage = (
    page: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    e.preventDefault();
    if (page !== currentPage) {
      setCurrentPage(page);
      setSliceData([...data].slice((page - 1) * perPage, page * perPage));
    }
  };

  const goToPrev = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
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

  const gotToNext = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
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
    filteredData,
    prevPage: goToPrev,
    nextPage: gotToNext,
    changePage,
    setFilteredData,
    setSearching,
  };
};
