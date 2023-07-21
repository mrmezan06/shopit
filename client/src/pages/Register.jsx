import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../components/MetaData';
import { useToasts } from 'react-toast-notifications';
import { clearErrors, register } from '../action/userAction';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addToast } = useToasts();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = user;
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('/images/avatar.jpg');

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
  }, [dispatch, error, isAuthenticated, addToast, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);
    formData.set('avatar', avatar);

    dispatch(register(formData));
  };

  const onChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <MetaData title={'Register'} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
              <label htmlFor="email_field">Name</label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      class="rounded-circle"
                      alt="user avatar"
                    />
                  </figure>
                </div>
                <div class="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    class="custom-file-input"
                    id="customFile"
                    accept="images/*"
                    onChange={onChange}
                  />
                  <label class="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              class="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              REGISTER
            </button>
            <Link
              to="/register"
              className="float-right mt-3"
              style={{ textDecoration: 'none' }}
            >
              <b>Already have an account?</b> Login
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
