import './App.scss';
import '@fortawesome/fontawesome-free/js/all';
import 'react-app-polyfill/ie11';
import React, { FC, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import { Redirect, Switch, Route, NavLink, useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

import useGoogle from '../hooks/useGoogle';
import useQuery from '../hooks/useQuery';
import { useDispatch, useSelector, actions } from '../store';

import Dashboard from './Dashboard';
import Cooking from './Cooking';

const App: FC = () => {
  const { query } = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const { signin, authenticate, signout } = useGoogle();
  const { user, error } = useSelector((state) => state);

  // Sign in the user either based on cookie or query.code provided by the redirect from Google Signin
  useEffect(() => {
    authenticate(query.code || '', { silent: !query.code });
  }, [authenticate]); // eslint-disable-line

  // When the app initialises, check for last page visited
  useEffect(() => {
    try {
      const lastPage = localStorage.getItem('last_page');

      // If last page is found, navigate to it
      if (lastPage) history.push(lastPage);
    } catch (e) {}
  }, []); // eslint-disable-line

  // Store the page visited every time the pathname changes
  useEffect(() => {
    try {
      localStorage.setItem('last_page', history.location.pathname + history.location.search);
    } catch (e) {}
  }, [history, history.location.pathname, history.location.search]);

  return (
    <div className="App">
      <header>
        <NavLink to="/" className="logo">
          NFQ Shopify App
        </NavLink>

        <NavLink to="/cooking">
          <i className="fas fa-utensils" /> Cooking
        </NavLink>
        {user ? (
          <div className="user-account">
            {!!user.picture && <img className="user-picture" src={user.picture} alt="" />}
            <span className="user-name">{user.name}</span>
            <span className="sign-out" onClick={() => signout()}>
              <i className="fas fa-sign-out-alt" />
            </span>
          </div>
        ) : (
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              signin();
            }}
          >
            <ReactSVG className="google" src="/google.svg" /> Sign in
          </a>
        )}
      </header>
      <main>
        <Switch>
          <Route path="/cooking">
            <Cooking />
          </Route>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
      <Modal
        animation={false}
        className="modal"
        size="lg"
        show={!!error}
        onHide={() => {
          dispatch(actions.set({ error: '' }));
        }}
      >
        <Modal.Header closeButton>An error occured</Modal.Header>
        <Modal.Body>
          <pre>{error}</pre>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
