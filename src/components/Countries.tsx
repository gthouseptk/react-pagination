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
  } = usePagination({ itemsPerPage, data, startFrom });
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState(
    searchByData && searchByData.length >= 1 ? searchByData[0].value : '',
  );
  const [searchFor, setSearchFor] = useState('');

  const submitHandler = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const filteredData = [...data].filter((country: CountriesTypes) => {
      let searchKey = 'name';
      if (searchByData && searchByData.length > 0) {
        searchKey = searchBy;
      }
      return `${country[searchKey]}`
        ?.toLowerCase()
        .includes(search.trim().toLowerCase());
    });
    setSearchFor(search);
  };

  return (
    <div className="wrapper">
      {searchByData && searchByData.length > 0 && (
        <>
          <form
            action=""
            className="my-3 is-flex is-justify-content-center"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              setSearchFor(search);
            }}
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
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                setSearchFor(search);
              }}
            >
              Search
            </button>
          </form>
          {searchFor && (
            <h2 className="mb-6 has-text-centered is-size-2">
              Search Results for: &ldquo;Search value&rdquo;
            </h2>
          )}
        </>
      )}
      {slicedData.length > 0 ? (
        <>
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Country</th>
                <th>Capital</th>
                <th>Code</th>
                <th>Currency</th>
                <th>Phone Code</th>
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
