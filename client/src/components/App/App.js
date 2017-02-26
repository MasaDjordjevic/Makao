import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import mainMuiTheme from '../../MainMuiTheme';

import routes from '../../routes';

class App extends Component {

    get styles() {
        return {
            app: {
                height: "100vh",
                display: "flex",
                justifyContent: "space-around",
                alignContent: "space-around",
                backgroundColor: "#ECEFF1"
            },
        };
    }

    render() {
        return (
            <div className="App" style={this.styles.app}>
                <MuiThemeProvider muiTheme={getMuiTheme(mainMuiTheme)}>
                    <Router history={browserHistory}
                            routes={routes}/>
                </MuiThemeProvider>
            </div>
        );
    }
}


export default App;
