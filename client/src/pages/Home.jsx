import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'react-js-pagination';

import MetaData from '../components/MetaData';
import { getProducts, clearErrors } from '../action/productAction';
import Product from '../components/product/Product';
import Loader from '../components/Loader';
import { useToasts } from 'react-toast-notifications';


const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  const { addToast } = useToasts();

  const { loading, products, error, productsCount, resPerPage } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      dispatch(clearErrors());
    }

    dispatch(getProducts(currentPage));
  }, [dispatch, error, addToast, currentPage]);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={'Buy Best Products Online'} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))}
            </div>
          </section>
          {resPerPage <= productsCount && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText={'Next'}
                prevPageText={'Prev'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
