/**
 * Created by Masa on 28-Dec-16.
 */
import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import {cyan500} from 'material-ui/styles/colors';
import mainMuiTheme from './MainMuiTheme';

import Game from './Game/Game';

const muiTheme = getMuiTheme({
    palette: {
        textColor: cyan500,
    },
    appBar: {
        height: 50,
    },
});

const Main = () => (
    <div>
        <MuiThemeProvider muiTheme={getMuiTheme(mainMuiTheme)}>
            <div>
                <Game />
            </div>
        </MuiThemeProvider>
    </div>
);

export default Main;