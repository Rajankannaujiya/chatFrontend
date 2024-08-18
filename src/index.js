import * as React from 'react';
import ReactDOM from 'react-dom/client';
// import 'react-app-polyfill/ie9';
// import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './Features/store';
import { BrowserRouter } from 'react-router-dom'
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>

        <App />

      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// reportWebVitals();
