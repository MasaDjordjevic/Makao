import React from 'react';
import Card from '../Card/Card';
import CardSymbol from '../Card/CardSymbol';
import {blueGrey300} from 'material-ui/styles/colors';

class LogEntry extends React.Component {
    get styles() {
        return {
            container: {
                alignSelf: this.props.left ? 'flex-start' : 'flex-end',
                display: 'flex',
            },
            cardContainer: {
                display: 'flex',
                alignItems: 'center',
            },
            playerName: {
                color: blueGrey300,
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                {this.props.playerName && <label style={this.styles.playerName}>{this.props.playerName}:&nbsp;</label>}
                {this.props.log && <label>{this.props.log}</label>}
                {this.props.card &&
                <div style={this.styles.cardContainer}>
                    <label>{this.props.card.stringify().short}&nbsp;</label>
                    <CardSymbol symbol={this.props.card.symbol} containerSize={12} padding={0.01}/>
                </div>
                }
            </div>
        );
    }
}
export default LogEntry;

LogEntry.defaultProps = {};

LogEntry.propTypes = {
    log: React.PropTypes.string,
    playerName: React.PropTypes.any,
    card: React.PropTypes.instanceOf(Card),
    left: React.PropTypes.bool,
};