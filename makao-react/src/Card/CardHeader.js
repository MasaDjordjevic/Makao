/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import Radium from 'radium';
import {font} from './common';
import CardSymbol from './CardSymbol';

class CardHeader extends React.Component {
    get circleSize(){
        return this.props.cardHeight / 5 / 2;
    }
    getStyles() {
        const cardHeight = this.props.cardHeight;
        const signPadding = 16;
        return {
            headerTextContainerStyle : {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: "3%",
            },
            numberStyle : {
                width: this.circleSize,
                color: "white",
                fontSize: cardHeight / 5 / 2,
                fontFamily: "Raleway",
                fontWeight: "100",
                textAlign: "center",
                marginLeft: signPadding
            },
            textStyle : {
                color: "white",
                fontSize: cardHeight / 5 / 6,
                fontFamily: font,
                fontWeight: "400",
                marginRight: "20px",
                marginTop: "10px",
                textAlign: "center",
            },

            headerCircleStyle : {
                display: "block",
                position: "absolute",
                width: this.circleSize,
                height: this.circleSize,
                left: signPadding,
                border: "none",
                borderRadius: "50%",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",

            },
        }
    }
    render() {
        return (
            <div>
                <div style={this.getStyles().headerTextContainerStyle}>
                    <span style={this.getStyles().numberStyle}>{this.props.number}</span>
                    <span style={this.getStyles().textStyle}>{this.props.numText.toUpperCase()}
                        &nbsp;OF&nbsp;{this.props.symbol.toUpperCase()}</span>
                </div>
                <div style={this.getStyles().headerCircleStyle}>
                    <CardSymbol containerSize={this.circleSize} symbol={this.props.symbol}/>
                </div>
            </div>
        );
    }
}

CardHeader.propTypes = {
    cardHeight: React.PropTypes.number.isRequired,
    number: React.PropTypes.string.isRequired,
    symbol: React.PropTypes.string.isRequired,
    numText: React.PropTypes.string.isRequired,
}

export default Radium(CardHeader);