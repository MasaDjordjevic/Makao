/**
 * Created by Masa on 06-Jan-17.
 */
import React from 'react';
import LogEntry from './LogEntry';
import Card from '../Card/Card';
import {blueGrey300} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

class Log extends React.Component {
    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
            },
            title: {
                margin: '5% 0',
                textAlign: 'center',
                fontSize: 14,
                color: blueGrey300,
            },
            logContainer: {
                display: 'flex',
                flexDirection: 'column',
                marginTop: '5%',
            }

        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <span style={this.styles.title}>LOG</span>
                <Divider />
                <div style={this.styles.logContainer}>
                {
                    this.props.logs.map((log, index) =>
                        <LogEntry key={index}
                                  log={log.log}
                                  playerName={log.playerId !== this.props.userId && log.playerName}
                                  left={log.playerId !== this.props.userId}
                                  card={log.card}/>
                    )
                }
                </div>
            </div>
        );
    }
}
export default Log;

Log.defaultProps = {
    userId: 1,
    logs: [
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
        {
            playerName: 'masa',
            playerId: 1,
            log: '',
            card: new Card('spades', '7'),
        },
        {
            playerName: 'darko',
            playerId: 2,
            log: 'vuce 3',
        },
        {
            playerName: 'nikolica',
            playerId: 3,
            card: new Card('hearts', '12'),
        },
    ],
};

Log.propTypes = {
    userId: React.PropTypes.number,
    logs: React.PropTypes.array.isRequired,
};