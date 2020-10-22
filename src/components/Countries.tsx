import React from 'react';
import {
  usePagination,
  usePaginationProps,
  PaginationProps,
} from '../hooks/usePagination';

interface CountriesTypes {
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
  return (
    <div className="wrapper">
      {searchByData && (
        <>
          <form action="" className="my-3 is-flex is-justify-content-center">
            <div className="select mr-2">
              <select name="Select" id="">
                {searchByData.map((search: SearchByDataProps) => (
                  <option value={search.value} key={search.value}>
                    {search.label}
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
                />
              </div>
            </div>
            <button type="submit" className="button is-link">
              Search
            </button>
          </form>
          <h2 className="mb-6 has-text-centered is-size-2">
            Search Results for: &ldquo;Search value&rdquo;
          </h2>
        </>
      )}
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
        <button type="button" className="pagination-next" onClick={nextPage}>
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
    </div>
  );
};

Countries.defaultProps = {
  searchByData: undefined,
};

export default Countries;
