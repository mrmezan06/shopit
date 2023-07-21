import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../components/MetaData';
import { useToasts } from 'react-toast-notifications';
import Loader from '../components/Loader';
import { login, clearErrors } from '../action/userAction';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addToast } = useToasts();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      addToast('Login Successfully', {
        appearance: 'success',
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      navigate('/');
    }

    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
        autoDismissTimeout: 3000,
      });
      dispatch(clearErrors());
    }
  }, [dispatch, error, isAuthenticated, addToast, email, password, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={'Login'} />
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">Login</h1>
                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Link
                  to="/password/forgot"
                  className="float-right mb-4"
                  style={{ textDecoration: 'none' }}
                >
                  Forgot Password?
                </Link>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  LOGIN
                </button>

                <Link
                  to="/register"
                  className="float-right mt-3"
                  style={{ textDecoration: 'none' }}
                >
                  <b>New User?</b> Register
                </Link>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
