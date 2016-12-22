/**
 * Created by Masa on 18-Dec-16.
 */
import React from 'react';
import Radium from 'radium';
import CardMain from './CardMain';
import CardHeader from './CardHeader';
import { blackColor, redColor, isBlack, rotatedStyle} from './common';



class Card extends React.Component {
    stringifyCard(number) {
        switch (+number) {
            case 1:
                return {num: "A", str: "ace"};
            case 2:
                return {num: "2", str: "two"};
            case 3:
                return {num: "3", str: "three"};
            case 4:
                return {num: "4", str: "four"};
            case 5:
                return {num: "5", str: "five"};
            case 6:
                return {num: "6", str: "six"};
            case 7:
                return {num: "7", str: "seven"};
            case 8:
                return {num: "8", str: "eight"};
            case 9:
                return {num: "9", str: "nine"};
            case 10:
                return {num: "10", str: "ten"};
            case 12:
                return {num: "J", str: "jack"};
            case 13:
                return {num: "Q", str: "queen"};
            case 14:
                return {num: "K", str: "king"};
            default:
                return null;
        }
    }

    get styles(){
        const cardHeight = this.props.cardHeight;
        const cardWidth = cardHeight/3*2;
        return {
            cardStyle: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: cardWidth,
                height: cardHeight,
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                marginRight: "10px",
                backgroundColor: "white",
                ':hover':{
                    transform: 'scale(1.05)'
                }
            },

            headerStyle: {
                width: "103%",
                marginLeft: "-1%", //ovo je zbog bele linije koja se pojavi sa leve strane karte u nekimm slucajevima
                backgroundColor: isBlack(this.props.symbol) ? blackColor : redColor,
                height: cardHeight / 5,
                position: "relative",
            }
        }
    }
    get cardName(){
        return this.stringifyCard(this.props.number);
    }
    render() {
        return (
            <div style={this.styles.cardStyle}>
                <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css?family=Raleway:100,200,400,600" rel="stylesheet"/>
                <div style={this.styles.headerStyle}>
                    <CardHeader
                        cardHeight={this.props.cardHeight}
                        symbol={this.props.symbol}
                        number={this.cardName.num}
                        numText={this.cardName.str}/>
                </div>
                <CardMain
                    number={this.props.number}
                    symbol={this.props.symbol}
                    cardHeight={this.props.cardHeight}/>
                <div style={{...this.styles.headerStyle, ...rotatedStyle}}>
                    <CardHeader
                        cardHeight={this.props.cardHeight}
                        symbol={this.props.symbol}
                        number={this.cardName.num}
                        numText={this.cardName.str}/>
                </div>

            </div>
        );
    }
}

Card.defaultProps = {
    cardHeight: 310,
};
Card.propTypes = {
    cardHeight: React.PropTypes.number,
    symbol: React.PropTypes.string.isRequired,
    number: React.PropTypes.string.isRequired,
};

export default Radium(Card);