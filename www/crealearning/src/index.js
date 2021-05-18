
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import React from 'react'
import ReactDOM from 'react-dom'
import './main.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './i18n'

//window.$url = 'http://crea.local/'
window.$url = 'http://localhost/'
window.$sha = 'Sok{2wPFvEp0A0PJJAw04Nm]pBZOJPaQ'
window.$froala = 'gVG3C-8G2G2C4B3C1C2ud1BI1IMNBUMRWAi1AYMSTRBUZYB-16D4E3D2C2C3H2B1B10B2A1=='

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
