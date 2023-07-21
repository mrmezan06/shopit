import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'react-js-pagination';

import MetaData from '../components/MetaData';
import { getSearchProducts, clearErrors } from '../action/productAction';
import Product from '../components/product/Product';
import Loader from '../components/Loader';
import { useToasts } from 'react-toast-notifications';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useLocation } from 'react-router-dom';

const { createSliderWithTooltip } = Slider;

const Range = createSliderWithTooltip(Slider.Range);

const SearchProduct = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 2000]);

  const keyword = useLocation().search.split('=')[1];
  //   console.log(keyword);

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

    dispatch(getSearchProducts(keyword, currentPage, price));
  }, [dispatch, error, addToast, currentPage, keyword, price]);

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
              {keyword !== '' ? (
                <>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px-5">
                      <Range
                        marks={{
                          1: `$1`,
                          1000: `$2000`,
                        }}
                        min={1}
                        max={2000}
                        defaultValue={[1, 2000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{
                          placement: 'top',
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
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
export default SearchProduct;
