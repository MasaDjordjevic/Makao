import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './components/AppRoutes/AppRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); // fixes the "unknown prop 'touchTap' error"

window.onload = function() {
  ReactDOM.render(<AppRoutes/>, document.getElementById('root'));
};

// if (typeof window !== 'undefined') {
//   ReactDOM.render(<AppRoutes/>, document.getElementById('root'));
// };
