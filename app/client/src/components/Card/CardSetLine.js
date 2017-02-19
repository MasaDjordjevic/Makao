/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardComponent from './CardComponent';
import {getCardWidth, font} from './common';

class CardSetLine extends React.Component {
    get styles() {
        const height = this.props.height;
        const cardWidth = getCardWidth(this.props.height);
        return {
            container: {
                width: this.props.width,
                height: height,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
            },
            cardContainer: {
                width: '1px',
                height: '100%',
                position: 'relative',
            },
            lastChild: {
                marginRight: cardWidth,
            },
            cardNum: {
                textAlign: 'right',
                position: 'absolute',
                bottom: height / 24,
                right: -cardWidth * 0.9, //nzm sto je ovo ovako
                color: "white",
                fontSize: height / 10,
                fontFamily: font,
                fontWeight: "400",
            },
        }
    }

    cardContainerStyle(i) {
        let style = this.styles.cardContainer;
        style.zIndex = i;
        if (i === this.props.cards.length - 1) {
            style = {...style, ...this.styles.lastChild};
        }
        return style;
    }

    componentWillMount() {
        if (this.props.sort)
            this.props.cards.sort((c1, c2) => c1.number - c2.number);
    }




    render() {
        const offset = this.props.width / this.props.cards.length;
        if (this.props.backCardNumberLabel && this.props.back) {
            var cardNum = <span style={this.styles.cardNum}>{this.props.cards.length}</span>
        }
        return (
            <div style={this.styles.container}>
                {
                    this.props.cards.map((card, i) =>
                        <div
                            key={i.toString()}
                            style={this.cardContainerStyle(i)}
                            onClick={() => this.props.onClick(card)}>
                            <CardComponent
                                back={this.props.back}
                                cardHeight={this.props.height}
                                card={card}
                                offset={offset}
                                mark={card && !!card.mustPlay}/>
                            {cardNum}
                        </div>
                    )
                }
            </div>
        );
    }
}
CardSetLine.defaultProps = {
    height: 310,
    backCardNumberLabel: true,
};
CardSetLine.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number,

    back: React.PropTypes.bool,
    backCardNumberLabel: React.PropTypes.bool,
    cardNumber: React.PropTypes.number,
    cards: React.PropTypes.array,
    sort: React.PropTypes.bool
};

export default CardSetLine;