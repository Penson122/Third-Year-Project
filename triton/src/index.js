import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import injectTapEventPlugin from 'react-tap-event-plugin';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

injectTapEventPlugin();
console.log('welcome to triton climate tools');
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
