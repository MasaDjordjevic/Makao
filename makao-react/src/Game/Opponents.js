/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardSet from '../Card/CardSet';
import TimerProgress from './TimerProgress';
import {blueGrey200} from 'material-ui/styles/colors';


Number.prototype.toRad = function () {
    return this * Math.PI / 180;
};

class Opponents extends React.Component {

    getStyles(i) {
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

        const top = 50 - 50 * Math.sin(angle.toRad()) + '%';
        const leftNum = Math.round(50 - 50 * Math.cos(angle.toRad()));
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

    isOnTurn(player) {
        return player.id === this.props.playerOnMoveId;
    }

    handleTimeExpiration(player){
        return function(){
            alert("Igracu " + player.name + " je isteklo vreme.");
        }
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
                        <div key={i.toString()} style={this.getStyles(i)}>
                            <CardSet height={height} width={width} back cardNumber={+player.cardNumber}/>
                            {this.isOnTurn(player) &&
                                <TimerProgress length={30} style={this.styles.timer} onTimeExpiration={this.handleTimeExpiration(player)}/>
                            }
                            <span style={this.styles.playerName}>{player.name.toLowerCase()}</span>
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
    playerOnMoveId: React.PropTypes.number.isRequired,
};

export default Opponents;