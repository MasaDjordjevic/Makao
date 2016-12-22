/**
 * Created by Masa on 18-Dec-16.
 */
import React from 'react';
import CardMain from './CardMain';
import CardHeader from './CardHeader';
import { blackColor, redColor, isBlack, rotatedStyle} from './common';

const cardHeight = 310;
const cardWidth = cardHeight/3*2;

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


    render() {
        const cardStyle = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: cardWidth,
            height: cardHeight,
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
            marginRight:"10px",
            backgroundColor: "white"
        };


        const headerStyle = {
            width: "103%",
            marginLeft: "-1%", //ovo je zbog bele linije koja se pojavi sa leve strane karte u nekimm slucajevima
            backgroundColor: isBlack(this.props.symbol) ? blackColor : redColor,
            height: cardHeight / 5,
            position: "relative",
        };


        var cardName = this.stringifyCard(this.props.number);
        return (
            <div style={cardStyle}>
                <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css?family=Raleway:100,200,400,600" rel="stylesheet"/>
                <div style={headerStyle}>
                    <CardHeader cardHeight={cardHeight} symbol={this.props.symbol} number={cardName.num}
                                numText={cardName.str}/>
                </div>
                <CardMain number={this.props.number} symbol={this.props.symbol} cardHeight={cardHeight}/>
                <div style={{...headerStyle, ...rotatedStyle}}>
                    <CardHeader cardHeight={cardHeight} symbol={this.props.symbol} number={cardName.num}
                                numText={cardName.str}/>
                </div>

            </div>
        );
    }
}


export default Card;