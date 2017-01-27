import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './components/AppRoutes/AppRoutes';

window.onload = function() {
  ReactDOM.render(<AppRoutes/>, document.getElementById('root'));
};

// if (typeof window !== 'undefined') {
//   ReactDOM.render(<AppRoutes/>, document.getElementById('root'));
// };
