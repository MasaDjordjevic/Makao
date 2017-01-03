/**
 * Created by Masa on 28-Dec-16.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import mainMuiTheme from './MainMuiTheme';


import Game from './Game/Game';
import Chat from './Game/Chat';

class Main extends React.Component {
    constructor(){
        super();

        this.state = {
            dimensions: {
                userCardsWidth: 700,
                userCardsHeight: 250,
                talon: 270,
                opponents: 150,
            }
        };

        this.handleResize = this.handleResize.bind(this);

    }

    handleResize() {
        const w = document.documentElement.clientWidth*0.5;
        const h = document.documentElement.clientHeight;

        let dimensions = {
            userCardsWidth: 700,
            userCardsHeight: 250,
            talon: 270,
            opponents: 150,
        };
        if (w < 1000) {
            dimensions.userCardsWidth = w * 7 / 10;
            dimensions.talon = w * 270 / 1000;
            dimensions.opponents = w * 15 / 100;
        }
        if (w < 550) {
            dimensions.userCardsWidth = w * 0.95;
        }
        if (h < 750) {
            dimensions.userCardsHeight = h * 250 / 750;
            dimensions.talon = h * dimensions.talon / 750;
            dimensions.opponents = h * dimensions.opponents / 750;
        }
        console.log(dimensions.talon);
        this.setState({dimensions: dimensions});
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillMount() {
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

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
                            <Game dimensions={this.state.dimensions}/>
                        </div>
                        <div style={this.styles.rightSidebar}>
                        </div>
                    </div>

                </MuiThemeProvider>
            </div>
        );
    }
}

export default Main;