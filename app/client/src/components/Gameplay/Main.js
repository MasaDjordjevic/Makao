/**
 * Created by Masa on 28-Dec-16.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import mainMuiTheme from '../../MainMuiTheme';

import GameResizeHandler from '../Game/GameResizeHandler';
import GameInitialiser from './GameInitialiser';
import RightSidebar from './RightSidebar';


class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            gameStarted: false,
        };


        this.handleGameStart = this.handleGameStart.bind(this);
    }

    handleGameStart(){
        this.setState({gameStarted: true});
    }

    get styles() {

        return {
            container: {
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                overflow: 'hidden',
            },
            game: {
                width: '100%',
                height: '100%',
                padding: '1% 1% 0 1%',
                boxSizing: 'border-box',
            },
            rightSidebar: {}
        }
    }


    render() {
        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(mainMuiTheme)}>
                    <div style={this.styles.container}>
                        <div style={this.styles.game}>
                            {this.state.gameStarted ? <GameResizeHandler/> : <GameInitialiser onGameStart={this.handleGameStart}/>}
                        </div>
                        <RightSidebar  />
                    </div>

                </MuiThemeProvider>
            </div>
        );
    }
}

export default Main;
