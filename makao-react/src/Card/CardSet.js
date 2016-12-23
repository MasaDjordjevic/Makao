/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardComponent from './CardComponent';

class CardSet extends React.Component{
    get styles(){
        const cardHeight = this.props.cardHeight;
    }
    render(){
        const cardNum = this.props.back ? this.props.cardNumber : this.props.cards.length;
        return(
            <div>
                {
                    this.props.back ?
                        Array(this.props.cardNumber).fill(0).map((card, i) =>
                            <CardComponent back key={i.toString()}/>
                        )
                        :
                        this.props.cards.map((card, i) =>
                            <CardComponent card={card} key={i.toString()}/>
                        )
                }
            </div>
        );
    }
}
CardSet.defaultProps = {
    cardHeight: 310,
};
CardSet.propTypes = {
    width: React.PropTypes.number.isRequired,

    back: React.PropTypes.bool,
    cardNumber: React.PropTypes.number,
    cards: React.PropTypes.array
};

export default CardSet;