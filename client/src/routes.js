import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CheckAuth from './utils/CheckAuth';
import Guest from './utils/Guest';
import CategoryForm from './components/FilterForm';
import BillForm from './components/BillForm';

export default createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <CheckAuth>
            <Home />
          </CheckAuth>
        ),
      },
      {
        path: '/login',
        element: (
          <Guest>
            <Login />
          </Guest>
        ),
      },
      {
        path: '/register',
        element: (
          <Guest>
            <Register />
          </Guest>
        ),
      },
      {
        path: '/filter',
        element: (
          <CheckAuth>
            <CategoryForm />
          </CheckAuth>
        ),
      },
      {
        path: '/bills',
        element: (
          <CheckAuth>
            <BillForm />
          </CheckAuth>
        ),
      },
    ],
  },
]);
