import React from 'react';
import ReactPaginate from 'react-paginate';

const Paging = ({ numOfPages, pageChanged }) => {
  return (
    <ReactPaginate
      previousLabel={<i className="material-icons">arrow_backward</i>}
      nextLabel={<i className="material-icons">arrow_forward</i>}
      breakLabel={'...'}
      breakClassName={'break-me'}
      pageCount={numOfPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={(e) => { pageChanged(e.selected + 1) }}
      containerClassName={'pagination'}
      activeClassName={'active'} />
  )
}

export default Paging
