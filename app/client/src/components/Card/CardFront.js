import React from 'react';
import Radium from 'radium';
import CardMain from './CardMain';
import CardHeader from './CardHeader';
import {
    blackColor,
    redColor,
    isBlack,
    rotatedStyle,
    getCardWidth,
    cardHoverGrowth,
    getCardBorderRadius
} from './common';
import Card from './Card';

class CardFront extends React.Component {

    get styles() {
        const cardHeight = this.props.cardHeight;
        const cardWidth = getCardWidth(cardHeight);
        const cardBorderRadius = getCardBorderRadius(cardHeight);

        let mark = {
            transform: 'scale(' + cardHoverGrowth + ')',
            cursor: 'pointer',
        };

        let hover = this.props.hover ? mark : null;

        let markObj = this.props.mark ? mark : {};

        return {
            cardStyle: {
                ...markObj, ...{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: cardWidth,
                    height: cardHeight,
                    borderRadius: cardBorderRadius,
                    overflow: "hidden",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                    marginRight: "10px",
                    backgroundColor: "white",
                    ':hover': hover,
                }
            },

            headerStyle: {
                width: "103%",
                marginLeft: "-1%", //ovo je zbog bele linije koja se pojavi sa leve strane karte u nekimm slucajevima
                backgroundColor: isBlack(this.props.card.symbol) ? blackColor : redColor,
                height: cardHeight / 5,
                position: "relative",
            }
        }
    }

    render() {
        return (
            <div style={this.styles.cardStyle}>
                <CardHeader
                    style={this.styles.headerStyle}
                    cardHeight={this.props.cardHeight}
                    card={this.props.card}
                    offset={this.props.offset}/>
                <CardMain
                    card={this.props.card}
                    cardHeight={this.props.cardHeight}/>

                <CardHeader
                    style={{...this.styles.headerStyle, ...rotatedStyle}}
                    cardHeight={this.props.cardHeight}
                    card={this.props.card}
                    offset={this.props.offset}/>
            </div>
        );
    }
}

CardFront.defaultProps = {
    cardHeight: 310,
    hover: true,
};
CardFront.propTypes = {
    cardHeight: React.PropTypes.number,
    hover: React.PropTypes.any,
    card: React.PropTypes.instanceOf(Card),
    offset: React.PropTypes.number,
    mark: React.PropTypes.bool,
};

export default Radium(CardFront);