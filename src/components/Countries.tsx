import React, { useState } from 'react';
import {
  usePagination,
  usePaginationProps,
  PaginationProps,
} from '../hooks/usePagination';

interface CountriesTypes {
  [key: string]: number | string | null;
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  capital: string;
  currency: string;
  native: string | null;
  emoji: string | null;
  emojiU: string | null;
}

interface IndexArrayString {
  [key: string]: string | number | null;
}

interface SearchByDataProps {
  label: string;
  value: string;
}

type CountriesPropsTypes<TSearch, TPagination> = TPagination & {
  searchByData?: TSearch;
};

const Countries = ({
  itemsPerPage,
  data,
  startFrom,
  searchByData,
}: CountriesPropsTypes<
  SearchByDataProps[],
  usePaginationProps<CountriesTypes>
>) => {
  const {
    slicedData,
    prevPage,
    nextPage,
    changePage,
    pagination,
    setFilteredData,
    setSearching,
    filteredData,
  } = usePagination({ itemsPerPage, data, startFrom });
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState(
    searchByData && searchByData.length >= 1 ? searchByData[0].value : '',
  );
  const [searchFor, setSearchFor] = useState('');
  const [sortByKey, setSortByKey] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const columns: SearchByDataProps[] = [
    { label: 'Country', value: 'name' },
    { label: 'Capital', value: 'capital' },
    { label: 'Country Code', value: 'iso2' },
    { label: 'Currency', value: 'currency' },
    { label: 'Phone Code', value: 'phone_code' },
  ];

  const sortData = <TSort extends IndexArrayString>(
    dataArr: TSort[],
    sortBy: string,
    orderBy: 'asc' | 'desc',
  ) => {
    const sorted = dataArr.sort((a: TSort, b: TSort): number => {
      const aSort = a[sortBy] || '';
      const bSort = b[sortBy] || '';

      if (orderBy === 'asc') {
        if (aSort < bSort) return -1;
        if (aSort > bSort) return 1;
        return 0;
      }
      if (aSort > bSort) return -1;
      if (aSort < bSort) return 1;
      return 0;
    });
    return sorted;
  };

  const handleSort = (sortBy: string, orderBy: 'asc' | 'desc') => {
    if (sortByKey !== sortBy) {
      setSortByKey(sortBy);
    }
    if (orderBy !== order) {
      setOrder(orderBy);
    }
    const sorted = sortData([...filteredData], sortBy, orderBy);
    setFilteredData(sorted);
  };

  const submitHandler = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setSearching(true);
    const searchedData = [...data].filter((country: CountriesTypes) => {
      let searchKey = 'name';
      if (searchByData && searchByData.length > 0) {
        searchKey = searchBy;
      }
      return `${country[searchKey] || ''}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    });
    const sortFiltered = sortData([...searchedData], sortByKey, order);
    setFilteredData(sortFiltered);
    setSearchFor(search);
    setSearching(false);
  };

  return (
    <div className="wrapper">
      {searchByData && searchByData.length > 0 && (
        <>
          <form
            action=""
            className="my-3 is-flex is-justify-content-center"
            onSubmit={submitHandler}
          >
            <div className="select mr-2">
              <select
                name="Select"
                id=""
                value={searchBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSearchBy(e.target.value);
                }}
              >
                {searchByData.map((searchData: SearchByDataProps) => (
                  <option value={searchData.value} key={searchData.value}>
                    {searchData.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field mr-2">
              <div className="control">
                <input
                  type="text"
                  name="Search"
                  className="input"
                  placeholder="Search..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              className="button is-link"
              onClick={submitHandler}
            >
              Search
            </button>
          </form>
          {searchFor && (
            <h2 className="mb-6 has-text-centered is-size-2">
              {`Search Results For: ${searchFor}`}
            </h2>
          )}
        </>
      )}
      {slicedData.length > 0 ? (
        <>
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                {columns.map((col: SearchByDataProps) => (
                  <th
                    key={col.value}
                    onClick={() =>
                      handleSort(
                        col.value,
                        sortByKey === col.value
                          ? order === 'asc'
                            ? 'desc'
                            : 'asc'
                          : 'asc',
                      )
                    }
                  >
                    {col.label}
                    {sortByKey === col.value && (
                      <span className="icon">
                        {order === 'asc' ? (
                          <i className="fas fa-sort-up" />
                        ) : (
                          <i className="fas fa-sort-down" />
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slicedData.map((item: CountriesTypes) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.capital}</td>
                  <td>{item.iso2}</td>
                  <td>{item.currency}</td>
                  <td>{item.phone_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="pagination is-rounded">
            <button
              type="button"
              className="pagination-previous"
              onClick={prevPage}
            >
              Previous
            </button>
            <button
              type="button"
              className="pagination-next"
              onClick={nextPage}
            >
              Next
            </button>
            <ul className="pagination-list">
              {pagination.map((page: PaginationProps) => {
                if (!page.ellipsis) {
                  return (
                    <button
                      key={page.id}
                      type="button"
                      className={`pagination-link ${
                        page.current ? 'is-current' : ''
                      }`}
                      onClick={(
                        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                      ) => changePage(page.id, e)}
                    >
                      {page.id}
                    </button>
                  );
                }
                return (
                  <li key={page.id}>
                    <span className="pagination-ellipsis">&hellip;</span>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      ) : (
        <div className="message is-link">
          <div className="message-body has-text-centered">No Results</div>
        </div>
      )}
    </div>
  );
};

Countries.defaultProps = {
  searchByData: undefined,
};

export default Countries;
