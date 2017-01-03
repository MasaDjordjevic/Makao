/**
 * Created by Masa on 28-Dec-16.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import mainMuiTheme from './MainMuiTheme';


import GameResizeHandler from './Game/GameResizeHandler';
import Chat from './Game/Chat';

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
                flexGrow: 4,
                width: '100%',
                height: '100%',
            },
            rightSidebar: {
                flexGrow: 1,
                backgroundColor: 'red',
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
                        <div style={this.styles.rightSidebar}>
                            <Chat />
                        </div>
                    </div>

                </MuiThemeProvider>
            </div>
        );
    }
}

export default Main;