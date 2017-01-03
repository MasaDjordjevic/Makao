/**
 * Created by Masa on 28-Dec-16.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import mainMuiTheme from './MainMuiTheme';


import GameResizeHandler from './Game/GameResizeHandler';
import RightSidebar from './Game/RightSidebar';

class Main extends React.Component {


    get styles() {

        return {
            container: {
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
            },
            game: {
                width: '100%',
                height: '100%',
            },
            rightSidebar: {

            }
        }
    }


    render() {
        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(mainMuiTheme)}>
                    <div style={this.styles.container}>
                        <div style={this.styles.game}>
                            <GameResizeHandler />
                        </div>
                        <RightSidebar />
                    </div>

                </MuiThemeProvider>
            </div>
        );
    }
}

export default Main;