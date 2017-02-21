import React from 'react';
import CardSet from '../Card/CardSet';
import TimerProgress from './TimerProgress';
import {blueGrey200} from 'material-ui/styles/colors';
import {toRad} from "../../util/util";


class Opponents extends React.Component {

    getStyles(i, online) {
        const angleDiff = 180 / (this.total + this.total % 2 - 1);
        const startAngle = 180;
        let angle = startAngle - angleDiff * (i + this.total % 2);
        if (this.total % 2 === 1) {
            if (i < Math.floor(this.total / 2))
                angle += angleDiff;
            if (i === Math.floor(this.total / 2)) {
                angle = 90;
            }
        } else {
            if (i === this.total / 2 - 1) {
                angle += angleDiff / 4;
            }
            else if (i === this.total / 2) {
                angle -= angleDiff / 4;

            }

        }

        const top = 50 - (Math.abs((50 * Math.sin(toRad(angle))))) + '%';
        const leftNum = Math.round(50 - 50 * Math.cos(toRad(angle)));
        const left = leftNum > 50 ? 'calc(' + leftNum + '% - ' + this.elementWidth + 'px)' :
            leftNum === 50 ? 'calc(' + leftNum + '% - ' + this.elementWidth / 2 + 'px)' : leftNum + '%';

        return {
            position: 'absolute',
            width: this.elementWidth,
            top: top,
            left: left,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: online ? 1 : 0.5

        }
    }

    get total() {
        var a = this.props.players.length;
        return a;
    }

    getEllipseLength(rx, ry) {
        let h = Math.pow((rx - ry), 2) / Math.pow((rx + ry), 2);
        return (Math.PI * ( rx + ry )) * (1 + ( (3 * h) / ( 10 + Math.sqrt(4 - (3 * h))) ));
    };


    get elementWidth() {
        return this.props.playerHeight / 3 * 4;
    }

    get styles() {
        return {
            playerName: {
                marginTop: '1%',
                color: blueGrey200,
                fontFamily: 'Roboto, sans-serif',
            },
            timer: {
                marginTop: '5%',
                width: '97%',
            },
            container: {
                width: '100%',
                height: '100%',
            }
        }
    }

    render() {
        const players = this.props.players;
        const width = this.elementWidth;
        let height = this.props.playerHeight;
        if (players.length > 8)
            height = height * players.length / 11;
        if (players.length > 10)
            height = height * players.length / 15;

        return (
            <div style={this.styles.container}>
                {
                    players.map((player, i) =>
                        <div key={i.toString()}
                             style={this.getStyles(i, player.online)}>
                            <CardSet height={height}
                                     width={width}
                                     back
                                     cardNumber={+player.cardNumber}/>
                            {player.username === this.props.playerOnMove &&
                            <TimerProgress length={this.props.moveTime}
                                           style={this.styles.timer}/>
                            }
                            <span style={this.styles.playerName}>{player.username.toLowerCase()}</span>
                        </div>
                    )
                }
            </div>
        );
    }
}

Opponents.propTypes = {
    players: React.PropTypes.array.isRequired,
    playerHeight: React.PropTypes.number,
    playerOnMove: React.PropTypes.string.isRequired,
    moveTime: React.PropTypes.number,
};

export default Opponents;
