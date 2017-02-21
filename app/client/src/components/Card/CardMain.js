import React from 'react';
import {isBlack, rotatedStyle} from './common';
import CardSymbol from './CardSymbol';
import CardSignRenderer from './CardSignRenderer';
import Card from './Card';

class CardMain extends React.Component {
    render() {
        const cardHeight = this.props.cardHeight;
        const mainStyle = {
            display: "flex",
            flexDirection: "column",
            textAlign: 'center',
            justifyContent: "space-around",
        };
        const rowCenter = {
            display: "flex",
            flexDirection: "row",
            textAlign: 'center',
            justifyContent: "center",
        };
        let mainSection;
        const num = this.props.card.number.toString();
        if (num > 10) {
            mainSection =
                <div style={mainStyle}>
                    <CardSignRenderer type={this.props.card.number}
                                      color={isBlack(this.props.card.symbol) ? "black" : "red"}/>
                    <div style={rotatedStyle}>
                        <CardSignRenderer type={this.props.card.number}
                                          color={isBlack(this.props.card.symbol) ? "black" : "red"}/>
                    </div>
                </div>
        } else {
            const symbolSize = num === '1' ? cardHeight / 3 : cardHeight / 8;
            const middle = Math.ceil(num / 2);
            var symArr = [];
            for (let i = 0; i < num; i++) {
                symArr.push(<CardSymbol containerSize={symbolSize}
                                        symbol={this.props.card.symbol}
                                        padding={0.15}
                                        key={i}/>);
            }
            const symUpper = symArr.slice().splice(0, middle);
            const symBottom = symArr.slice().splice(middle, +num);

            if (num === '3') {
                mainSection =
                    <div style={rowCenter}>
                        <div style={rowCenter}>
                            {symBottom}
                        </div>
                        <div style={{...rowCenter, ...rotatedStyle}}>
                            {symBottom}
                        </div>
                        <div>
                            {symBottom}
                        </div>
                    </div>
            } else {
                mainSection =
                    <div style={num === '2' ? rowCenter : mainStyle}>
                        <div style={rowCenter}>
                            {symUpper}
                        </div>
                        <div style={{...rowCenter, ...rotatedStyle}}>
                            {symBottom}
                        </div>
                    </div>
            }
        }

        return mainSection;
    }
}

export default CardMain;

CardMain.propTypes = {
    card: React.PropTypes.instanceOf(Card).isRequired,
};