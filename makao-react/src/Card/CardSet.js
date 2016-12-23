/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardComponent from './CardComponent';
import {getCardWidth} from './common';

class CardSet extends React.Component{
    get styles(){
        return {
            container: {
                width: this.props.setWidth,
                position: 'relative',
            },
            card: {
                position: 'absolute',
            }
        }
    }

    componentWillMount(){
        if(this.props.sort)
            this.props.cards.sort((c1, c2) => c1.number-c2.number);
    }

    render(){
        const cardNum = this.props.back ? this.props.cardNumber : this.props.cards.length;
        const setWidth = this.props.width;
        const offset = setWidth/cardNum;

        console.log(offset);
        return(
            <div style={this.styles.container}>
                {
                    this.props.back ?
                        Array(this.props.cardNumber).fill(0).map((card, i) =>
                            <div key={i.toString()} style={{...this.styles.card, ...{left: i*offset}}}>
                                <CardComponent back />
                            </div>
                                )
                        :
                        this.props.cards.map((card, i) =>
                            <div key={i.toString()} style={{...this.styles.card, ...{left: i*offset}}}>
                                <CardComponent card={card} key={i.toString()} offset={offset}/>
                            </div>
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
    cards: React.PropTypes.array,
    sort: React.PropTypes.bool
};

export default CardSet;