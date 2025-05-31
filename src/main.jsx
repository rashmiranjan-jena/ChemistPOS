import React from 'react'
import ReactDOM from "react-dom/client"
import App from './App.jsx'
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter, HashRouter } from 'react-router-dom'
import "./i18n"
import { Provider } from 'react-redux'
import store from './store/index.js'
import { BusinessProvider } from './context/BusinessContext.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <Provider store={store}>
    <BusinessProvider>
      <HashRouter>
        <App />
      </HashRouter>
      </BusinessProvider>
    </Provider>
  </React.Fragment>,
);

serviceWorker.unregister()