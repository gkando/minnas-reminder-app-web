import React from 'react';
import ReactDOM from 'react-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// import MomentUtils from '@date-io/moment';
import DayjsUtils from '@date-io/dayjs';
import './index.css';
import App from './App';
import { Provider } from './context/store'

ReactDOM.render(
  <Provider>
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <App />
    </MuiPickersUtilsProvider>
  </Provider>,
  document.getElementById("root")
);
