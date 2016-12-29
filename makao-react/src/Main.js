/**
 * Created by Masa on 28-Dec-16.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import mainMuiTheme from './MainMuiTheme';

import Game from './Game/Game';


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