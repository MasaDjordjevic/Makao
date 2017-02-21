import React from 'react';
import Card from '../Card/Card';
import CardSymbol from '../Card/CardSymbol';
import {blueGrey300, teal900} from 'material-ui/styles/colors';

class LogEntry extends React.Component {
    get styles() {
        return {
            container: {
                alignSelf: this.props.win ? 'center' : this.props.left ? 'flex-start' : 'flex-end',
                display: 'flex',
            },
            cardContainer: {
                display: 'flex',
                alignItems: 'center',
            },
            jackSymbolContainer: {
                display: 'flex',
                alignItems: 'baseline'
            },
            playerName: {
                color: this.props.win ? teal900 : blueGrey300,
            }
        }
    }

    get playerName() {
        return this.props.playerName + (this.props.win ? '' : ':');
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                {this.props.playerName &&
                <span style={this.styles.playerName}>{this.playerName}&nbsp;</span>
                }
                {this.props.log && <span>{this.props.log}</span>}
                {this.props.win && <span>wins</span>}
                {this.props.card &&
                <div style={this.styles.cardContainer}>
                    <span>{this.props.card.stringify().short}&nbsp;</span>
                    <CardSymbol symbol={this.props.card.symbol}
                                containerSize={12}
                                padding={0.01}/>
                    {this.props.card.jackSymbol &&
                    <div style={this.styles.jackSymbolContainer}>
                        <span>&nbsp;&#65515;&nbsp;</span>
                        <CardSymbol symbol={this.props.card.jackSymbol}
                                    containerSize={12}
                                    padding={0.01}/>
                    </div>}
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