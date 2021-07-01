import './Dashboard.scss';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

const Dashboard: FC = () => {
  return (
    <div className="Dashboard">
      <div className="intro">
        <div className="text">
          <p>
            <img src="https://github.com/vincentvinh/boiler-plate-app-shopify" alt="" />
            <label>This is an example of how to build a complex web application using</label>
            <ul>
              <li>shopify Apis.</li>
              <li>Google Auth</li>
              <li>AWS S3 bucket</li>
              <li>Firebase Admin for db</li>
            </ul>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/vincentvinh/boiler-plate-app-shopify"
            >
              Github
            </a>
            . Both the client and server are written in{' '}
            <a target="_blank" rel="noreferrer" href="https://www.typescriptlang.org">
              TypeScript
            </a>
            , using{' '}
            <a target="_blank" rel="noreferrer" href="https://reactjs.org">
              React
            </a>{' '}
            and{' '}
            <a target="_blank" rel="noreferrer" href="https://nodejs.org">
              NodeJS
            </a>
            . If you need tips on how to develop apps or just want to chat, use the{' '}
            <NavLink to="/messenger">Messenger</NavLink> page,{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/vincent-christophe"
            >
              LinkedIn
            </a>{' '}
            or{' '}
            <a target="_blank" rel="noreferrer" href="mailto:vincent.christophe@nfq.asia">
              vincent.christophe@nfq.asia
            </a>
            .
          </p>
        </div>
      </div>
      <div>
        <NavLink className="icon" to="/shopify">
          <i className="fas fa-shopping-cart" /> Shopify
        </NavLink>
        <ul>
          <li>
            Implements the{' '}
            <a target="_blank" rel="noreferrer" href="https://shopify.dev/api/admin">
              Shopify Admin Api
            </a>{' '}
            and{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://shopify.dev/api/admin/graphql/reference"
            >
              Using Shopify graphql API
            </a>
          </li>
          <li>Users load the product from shopify admin</li>
          <li>Displays a list of products with filters and sort options</li>
        </ul>
      </div>
      <div>
        <NavLink className="icon" to="/cooking">
          <i className="fas fa-utensils" /> Cooking
        </NavLink>
        <ul>
          <li>
            Implements the{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://developers.google.com/identity/protocols/oauth2"
            >
              Google oAuth API
            </a>{' '}
            and{' '}
            <a target="_blank" rel="noreferrer" href="https://aws.amazon.com/s3">
              AWS S3 API
            </a>
          </li>
          <li>Users can submit new recipes when signed in</li>
          <li>Displays a list of recipes with filters and sort options</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
