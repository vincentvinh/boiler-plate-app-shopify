import './Shopify.scss';
import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

const Shopify: FC = () => {
  return (
    <div className="Shopify">
      <div className="intro">
        <div className="text">
          <p>
            <img src="https://github.com/vincentvinh/boiler-plate-app-shopify" alt="" />
            This is an example of how to build a complex web application using shopify Apis. Feel free to explore each
            page and download the source code available on{' '}
            <a target="_blank" rel="noreferrer" href="https://github.com/vincentvinh/boiler-plate-app-shopify">
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
            <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/vincent-christophe">
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
    </div>
  );
};

export default Shopify;
