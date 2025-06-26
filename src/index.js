import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import Main from './pages/Main/Main';

import Home from './pages/Home/Home';

import RadioArctic from './pages/Radio/RadioArctic/RadioArctic';
import RadioPilot from './pages/Radio/RadioPilot/RadioPilot';
import RadioPolar from './pages/Radio/RadioPolar/RadioPolar';
import ConectItem from './pages/ConectItem';
import RadioMenu from './pages/Radio/RadioMenu/RadioMenu';
import ConnectMenu from './pages/ConnectMenu/ConnectMenu';
import Morze from './pages/Morze';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/radio_menu',
    element: <RadioMenu />,
  },
  {
    path: '/connect_menu',
    element: <ConnectMenu />,
  },
  {
    path: '/morze_menu',
    element: <Morze />,
  },
  {
    path: '/radio_arctic',
    element: <RadioArctic />,
  },
  {
    path: '/connect-item/:id',
    element: <ConectItem />,
  },
  {
    path: '/radio_pilot',
    element: <RadioPilot />,
  },
  {
    path: '/radio_polar',
    element: <RadioPolar />,
  },
]);
root.render(<RouterProvider router={router} />);
