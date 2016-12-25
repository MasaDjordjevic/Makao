/**
 * Created by Masa on 18-Dec-16.
 */

import React from 'react';
import {isBlack, rotatedStyle} from './common';
import CardSymbol from './CardSymbol';
import CardSignRenderer from './CardSignRenderer';


class CardMain extends React.Component {
    render() {
        const cardHeight = this.props.cardHeight;
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
        const num = this.props.card.number;
        if (num > 10) {
            mainSection =
                <div style={mainStyle}>
                    <CardSignRenderer type={this.props.card.number}
                                      color={isBlack(this.props.symbol) ? "black" : "red"}/>
                    <div style={rotatedStyle}>
                        <CardSignRenderer type={this.props.card.number}
                                          color={isBlack(this.props.symbol) ? "black" : "red"}/>
                    </div>
                </div>
        } else {

            const symbolSize = num === 1 ? cardHeight / 3 : cardHeight / 6;
            const middle = Math.ceil(num / 2);
            var symArr = [];
            for (let i = 0; i < num; i++) {
                symArr.push(<CardSymbol containerSize={symbolSize} symbol={this.props.card.symbol} lineHeight={35}
                                        margin={4}
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

export default CardMain;