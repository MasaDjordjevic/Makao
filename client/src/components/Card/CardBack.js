import React from 'react';
import Radium from 'radium';
import {redColor, blackColor, getCardWidth, getCardBorderRadius} from './common';
import CardSymbol from './CardSymbol';

class CardBack extends React.Component {
    get cardWidth() {
        return getCardWidth(this.props.cardHeight);
    }

    get circleSize() {
        return this.cardWidth * 0.7
    }

    get styles() {
        const cardHeight = this.props.cardHeight;
        const border = '2px grey solid';
        const cardBorderSize = cardHeight / 31;
        const cardBorderRadius = getCardBorderRadius(cardHeight);
        let hover;
        if (this.props.hover) {
            hover = {
                cursor: this.props.hover
            }
        } else {
            hover = {
                cursor: 'default',
            }
        }
        return {
            container: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: this.cardWidth,
                height: cardHeight,
                borderRadius: cardBorderRadius,
                overflow: "hidden",
                boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                border: cardBorderSize + 'px white solid',
                boxSizing: 'border-box',
                position: 'relative',
                ':hover': hover,
            },
            half: {
                width: '100%',
                height: this.props.cardHeight / 2,
            },
            upperHalf: {
                backgroundColor: redColor,
            },
            bottomHalf: {
                backgroundColor: blackColor,
            },
            center: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "absolute",
                width: this.circleSize,
                height: this.circleSize,
                top: this.props.cardHeight / 4,
                left: (this.cardWidth - 2 * cardBorderSize) / 2 - this.circleSize / 2,
                border: "none",
                borderRadius: "50%",
                backgroundColor: "white",
                transform: 'rotate(45deg)'
            },
            circle: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "center",
                alignItems: 'center',
            },
            verticalSeparator: {
                width: 1,
                height: this.circleSize / 2 * 0.7,
                backgroundColor: '#e9edef'
            },
            horizontalSeparator: {
                height: 1,
                width: this.circleSize * 0.7,
                backgroundColor: '#e9edef'
            },
            circleHalf: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "space-around",
                alignItems: 'center',
                width: "65%",
                height: '100%',
            },
            circleFourth: {
                width: this.circleSize * 0.25,
                transform: 'rotate(-45deg)'
            },
            borderRight: {
                borderRight: border,
            },
            borderBottom: {
                borderBottom: border,
            }

        }
    }

    renderHalf(symbol1, symbol2) {
        const symbolSize = this.circleSize * 0.16;
        const margin = '0 auto';
        const padding = 0.01;
        return (
            <div style={this.styles.circleHalf}>
                <div style={this.styles.circleFourth}>
                    <CardSymbol containerSize={symbolSize} padding={padding} margin={margin} symbol={symbol1}/>
                </div>
                <div style={this.styles.verticalSeparator}>
                </div>
                <div style={this.styles.circleFourth}>
                    <CardSymbol containerSize={symbolSize} padding={padding} margin={margin} symbol={symbol2}/>
                </div>
            </div>
        )
    }

    render() {

        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={[this.styles.half, this.styles.upperHalf]}></div>
                <div style={this.styles.center}>
                    <div style={this.styles.circle}>
                        {this.renderHalf("hearts", "spades")}
                        <div style={this.styles.horizontalSeparator}></div>
                        {this.renderHalf("clubs", "diamonds")}
                    </div>
                </div>
                <div style={[this.styles.half, this.styles.bottomHalf]}></div>
            </div>
        );
    }
}

export default Radium(CardBack);

CardBack.propTypes = {
    cardHeight: React.PropTypes.number.isRequired,
    hover: React.PropTypes.any,
};

