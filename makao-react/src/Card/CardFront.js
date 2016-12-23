/**
 * Created by Masa on 23-Dec-16.
 */
/**
 * Created by Masa on 18-Dec-16.
 */
import React from 'react';
import Radium from 'radium';
import CardMain from './CardMain';
import CardHeader from './CardHeader';
import { blackColor, redColor, isBlack, rotatedStyle, getCardWidth} from './common';



class CardFront extends React.Component {

    get styles(){
        const cardHeight = this.props.cardHeight;
        const cardWidth = getCardWidth(cardHeight);
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
                backgroundColor: isBlack(this.props.card.symbol) ? blackColor : redColor,
                height: cardHeight / 5,
                position: "relative",
            }
        }
    }

    render() {
        return (
            <div style={this.styles.cardStyle}>
                <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css?family=Raleway:100,200,400,600" rel="stylesheet"/>
                <div style={this.styles.headerStyle}>
                    <CardHeader
                        cardHeight={this.props.cardHeight}
                        card={this.props.card}/>
                </div>
                <CardMain
                    card={this.props.card}
                    cardHeight={this.props.cardHeight}/>
                <div style={{...this.styles.headerStyle, ...rotatedStyle}}>
                    <CardHeader
                        cardHeight={this.props.cardHeight}
                        card={this.props.card}/>
                </div>

            </div>
        );
    }
}

CardFront.defaultProps = {
    cardHeight: 310,
};
CardFront.propTypes = {
    cardHeight: React.PropTypes.number,
};

export default Radium(CardFront);