import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MetaData from '../components/MetaData';
import { getProducts } from '../action/productAction';
import Product from '../components/product/Product';
import Loader from '../components/Loader';
import { useToasts } from 'react-toast-notifications';

const Home = () => {
  const dispatch = useDispatch();

  const { addToast } = useToasts();

  const { loading, products, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
    }
    // dispatch(clearErrors());

    dispatch(getProducts());
  }, [dispatch, error, addToast]);

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
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Home;
