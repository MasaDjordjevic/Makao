import React from 'react';
import {blackColor, redColor, isBlack} from './common';

class CardSymbol extends React.Component {
    get styles() {
        const containerSize = this.props.containerSize;
        var style = {
            container: {
                width: containerSize,
                height: containerSize,
                lineHeight: containerSize + 'px',
                textAlign: 'center',
                boxSizing: 'border-box',
                padding: containerSize*0.25,
                margin: 0,
            },
            svg: {
                display: 'block',
                height: '100%',
                width: '100%',
                margin: '0 auto',
            }

        };
        if (this.props.padding) {
            style.container.padding = this.props.containerSize * this.props.padding;
        }
        if (this.props.margin) {
            style.container.margin = this.props.margin;
        }

        return style;
    }

    render() {
        const color = isBlack(this.props.symbol) ? blackColor : redColor;
        let symbol;
        switch (this.props.symbol) {
            case "spades":
                symbol = <svg viewBox="0 0 18.6 19.5" style={this.styles.svg}>
                    <g>
                        <path fill={color}
                              d="M17.2,9.5L17.2,9.5L9.3,0l-8,9.5h0c-0.8,0.8-1.3,2-1.3,3.3c0,2.6,2.1,4.6,4.6,4.6c2.5,0,4.6-2.1,4.6-4.6h0 c0,2.5,2.1,4.6,4.6,4.6c2.6,0,4.6-2.1,4.6-4.6C18.6,11.4,18,10.3,17.2,9.5z"/>
                        <polygon fill="#363636" points="6.8,19.5 11.8,19.5 9.3,15.1"/>
                    </g>
                </svg>;
                break;
            case "diamonds":
                symbol =
                    <svg  viewBox="0 0 18.2 21.7" style={this.styles.svg}>
                        <g>
                            <polygon fill={color} points="9.1,0 0,10.8 9.1,21.7 18.2,10.8"/>
                        </g>
                    </svg>;
                break;
            case "clubs":
                symbol = <svg viewBox="0 0 18.2 19.1" style={this.styles.svg}>
                    <g>
                        <path fill={color}
                              d="M13.6,7.7c-0.6,0-1.2,0.1-1.7,0.3c1.1-0.8,1.7-2.1,1.7-3.6c0-2.5-2-4.5-4.5-4.5S4.5,2,4.5,4.5 c0,1.4,0.7,2.7,1.7,3.6C5.7,7.9,5.2,7.7,4.5,7.7C2,7.7,0,9.8,0,12.3s2,4.5,4.5,4.5s4.5-2,4.5-4.5c0,0,0,0,0,0l0,0l0,0c0,0,0,0,0,0 c0,2.5,2,4.5,4.5,4.5c2.5,0,4.5-2,4.5-4.5S16.1,7.7,13.6,7.7z"/>
                        <polygon fill="#363636" points="6.6,19.1 11.6,19.1 9.1,14.7"/>
                    </g>
                </svg>;
                break;
            case "hearts":
                symbol =
                    <svg viewBox="0 0 18.2 17" style={this.styles.svg}>
                        <path fill={color}
                              d="M18.2,4.5c0-2.5-2-4.5-4.5-4.5c-2.5,0-4.5,2-4.5,4.5h0C9.1,2,7,0,4.5,0C2,0,0,2,0,4.5 c0,1.2,0.5,2.4,1.3,3.2h0L9.1,17l7.8-9.3h0C17.7,6.9,18.2,5.8,18.2,4.5z"/>
                    </svg>;

                break;
            default:
        }

        return (
            <div style={this.styles.container}>
                {symbol}
            </div>
        );
    }
}

export default CardSymbol;

CardSymbol.defaultProps = {
    containerSize: 10,
};

CardSymbol.propTypes = {
    symbol: React.PropTypes.oneOf(['spades', 'diamonds', 'clubs', 'hearts']).isRequired,
    containerSize: React.PropTypes.number,
    padding: React.PropTypes.number,
};