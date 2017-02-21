import React from 'react';
import GameSocketWrapper from './GameSocketWrapper';
import {getScoresWidth} from "./common";

export default class GameResizeHandler extends React.Component {
    constructor() {
        super();

        this.state = {
            dimensions: {
                userCardsWidth: 700,
                userCardsHeight: 250,
                talon: 270,
                opponents: 150,
                showScores: true,
            },
            playerNum: 3,
        };

        this.handleResize = this.handleResize.bind(this);
        this.handlePlayerNum = this.handlePlayerNum.bind(this);

    }

    handleResize() {
        const w = document.documentElement.clientWidth;
        const h = document.documentElement.clientHeight;
        const playerNum = this.state.playerNum;
        const scoresWidth = getScoresWidth(playerNum);
        let dimensions = {
            userCardsWidth: 700,
            userCardsHeight: 250,
            talon: 270,
            opponents: 150,
            showScores: true,
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

        if (w < (scoresWidth + dimensions.userCardsWidth + 100) * 1.2) {
            dimensions.showScores = false;
        }

        this.setState({dimensions: dimensions});
    }

    handlePlayerNum(num) {
        if (num) {
            this.setState({playerNum: num});
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    render() {
        return (
            <GameSocketWrapper dimensions={this.state.dimensions}
                               creatorUsername={this.props.creatorUsername}
                               socket={this.props.socket}
                               onPlayerNum={this.handlePlayerNum}/>
        );
    }
}