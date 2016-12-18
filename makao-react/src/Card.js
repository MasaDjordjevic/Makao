/**
 * Created by Masa on 18-Dec-16.
 */
import React from 'react';
import CardSignRenderer from './CardSignRenderer';

const cardHeight = 310;
const cardWidth = cardHeight/3*2;
const blackColor = "#36474f";
const redColor = "#d4494f";

const font = "Roboto Condensed";
const rotatedStyle = {
    transform: "rotate(180deg)",
};

function isBlack(symbol) {
    return symbol === "spades" || symbol === "clubs";
}

class CardSymbol extends React.Component {
    render() {

        const circleSize = this.props.containerSize;
        const circleSignSize = circleSize * 0.7;
        const headerCircleSignStyle = {
            lineHeight: circleSize + "px",
            fontSize: circleSignSize + "px",
            margin: "auto",
            fontFamily: "monospace",
            fontWeight: "600",
            color: isBlack(this.props.symbol) ? blackColor : redColor,
        };
        if (this.props.lineHeight) {
            headerCircleSignStyle.lineHeight = this.props.lineHeight + "px";
        }
        if (this.props.margin) {
            headerCircleSignStyle.marginRight = this.props.margin + "px";
            headerCircleSignStyle.marginLeft = this.props.margin + "px";
        }
        var cardSymbol;
        switch (this.props.symbol) {
            case "spades":
                cardSymbol = <span style={headerCircleSignStyle}>&spades;</span>;
                break;
            case "diamonds":
                cardSymbol = <span style={headerCircleSignStyle}>&diams;</span>;
                break;
            case "clubs":
                cardSymbol = <span style={headerCircleSignStyle}>&clubs;</span>;
                break;
            case "hearts":
                cardSymbol = <span style={headerCircleSignStyle}>&hearts;</span>;
                break;
            default:
        }

        return (
            cardSymbol
        );
    }
}

class CardHeader extends React.Component {

    render() {
        const headerTextContainerStyle = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: "3%",
        };
        const circleSize = cardHeight / 5 / 2;
        const signPadding = 16;
        const numberStyle = {
            width: circleSize,
            color: "white",
            fontSize: cardHeight / 5 / 2,
            fontFamily: "Raleway",
            fontWeight: "100",
            textAlign: "center",
            marginLeft: signPadding
        };
        const textStyle = {
            color: "white",
            fontSize: cardHeight / 5 / 6,
            fontFamily: font,
            fontWeight: "400",
            marginRight: "20px",
            marginTop: "10px",
            textAlign: "center",
        };

        const headerCircleStyle = {
            display: "block",
            position: "absolute",
            width: circleSize,
            height: circleSize,
            left: signPadding,
            border: "none",
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",

        };


        return (
            <div>
                <div style={headerTextContainerStyle}>
                    <span style={numberStyle}>{this.props.number}</span>
                    <span style={textStyle}>{this.props.numText.toUpperCase()}
                        &nbsp;OF&nbsp;{this.props.symbol.toUpperCase()}</span>
                </div>
                <div style={headerCircleStyle}>
                    <CardSymbol containerSize={circleSize} symbol={this.props.symbol}/>
                </div>
            </div>
        );
    }
}

class CardMain extends React.Component {
    render() {
        const mainStyle = {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
        };
        const mainStyle23 = {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
        };
        var mainSection;
        const num = this.props.number;
        if (this.props.number > 10) {
            mainSection =
                <div style={mainStyle}>
                    <CardSignRenderer type={this.props.number} color={isBlack(this.props.symbol)? "black" : "red"}/>
                    <div style={rotatedStyle}>
                        <CardSignRenderer type={this.props.number} color={isBlack(this.props.symbol)? "black" : "red"}/>
                    </div>
                </div>
        } else {

            const symbolSize = num === 1 ? cardHeight / 3 : cardHeight / 6;
            const middle = Math.ceil(num / 2);
            var symArr = [];
            for (let i = 0; i < num; i++) {
                symArr.push(<CardSymbol containerSize={symbolSize} symbol={this.props.symbol} lineHeight={35} margin={4}
                                        key={i}/>);
            }
            const symUpper = symArr.slice().splice(0, middle);
            const symBottom = symArr.slice().splice(middle, num);

            if (num === 2) {
                mainSection =
                    <div style={mainStyle23}>
                        <div>
                            {symUpper}
                        </div>
                        <div style={rotatedStyle}>
                            {symBottom}
                        </div>
                    </div>
            } else if (num === 3) {
                mainSection =
                    <div style={mainStyle23}>
                        <div>
                            {symBottom}
                        </div>
                        <div style={rotatedStyle}>
                            {symBottom}
                        </div>
                        <div>
                            {symBottom}
                        </div>
                    </div>
            } else {
                mainSection =
                    <div style={mainStyle}>
                        <div>
                            {symUpper}
                        </div>
                        <div style={rotatedStyle}>
                            {symBottom}
                        </div>
                    </div>
            }
        }

        return mainSection;
    }
}

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
                <CardMain number={this.props.number} symbol={this.props.symbol}/>
                <div style={{...headerStyle, ...rotatedStyle}}>
                    <CardHeader cardHeight={cardHeight} symbol={this.props.symbol} number={cardName.num}
                                numText={cardName.str}/>
                </div>

            </div>
        );
    }
}


export default Card;