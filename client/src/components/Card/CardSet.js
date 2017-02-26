import React from 'react';
import CardSetLine from './CardSetLine';
import _ from 'lodash';
import {cardHoverGrowth} from './common'


class CardSet extends React.Component {
    get styles() {
        const height = this.props.height;
        return {
            container: {
                width: this.props.width,
                height: height * 1.05,
                position: 'relative',
                overflow: 'hidden',
            },
        }
    }

    componentWillMount() {
        if (this.props.sort)
            this.props.cards.sort((c1, c2) => c1.number - c2.number);
    }

    render() {
        const cardArray = this.props.back ? Array(this.props.cardNumber).fill(null) : this.props.cards;
        const chunkSize = this.props.back ? cardArray.length : this.props.chunkSize;
        const cardArrays = _.chunk(cardArray, chunkSize);
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                {cardArrays.map((arr, i) =>
                    <div style={{
                        zIndex: i,
                        position: 'absolute',
                        top: i * this.props.height / cardArrays.length + (this.props.height * (cardHoverGrowth - 1))
                    }}
                         key={i.toString()}>
                        <CardSetLine
                            onClick={(card) => this.props.onClick(card)}
                            height={this.props.height}
                            width={this.props.width}
                            cards={arr}
                            back={this.props.back}/>
                    </div>
                )}
            </div>
        );
    }
}
CardSet.defaultProps = {
    height: 310,
    chunkSize: 10,
};
CardSet.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number,
    back: React.PropTypes.bool,
    cardNumber: React.PropTypes.number,
    cards: React.PropTypes.array,
    sort: React.PropTypes.bool
};

export default CardSet;