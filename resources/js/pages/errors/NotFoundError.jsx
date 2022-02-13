import React from 'react';
import { Link } from 'react-router-dom';
const NotFoundError = () => {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to='/' className='btn'>
        Back Home
      </Link>
    </div>
  );
};

export default NotFoundError;
