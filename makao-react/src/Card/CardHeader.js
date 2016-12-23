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
        const signPadding = !this.props.offset || this.props.offset > 50 ? 16 : this.props.offset/7 ;
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
                fontFamily: "Dosis",
                fontWeight: "200",
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
                    <span style={this.getStyles().numberStyle}>{this.props.card.stringify().short}</span>
                    <span style={this.getStyles().textStyle}>{this.props.card.stringify().long.toUpperCase()}
                        &nbsp;OF&nbsp;{this.props.card.symbol.toUpperCase()}</span>
                </div>
                <div style={this.getStyles().headerCircleStyle}>
                    <CardSymbol containerSize={this.circleSize} symbol={this.props.card.symbol}/>
                </div>
            </div>
        );
    }
}

CardHeader.propTypes = {
    cardHeight: React.PropTypes.number.isRequired,
}

export default Radium(CardHeader);