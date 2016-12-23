/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardSetLine from './CardSetLine';
import _ from 'lodash';

class CardSet extends React.Component{
    get styles(){
        return {
            container: {
                width: this.props.width,
                height: this.props.height,
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
        const cardArray = this.props.back ? Array(this.props.cardNumber).fill(null) : this.props.cards;
        const chunkSize = 15;
        const cardArrays = _.chunk(cardArray,chunkSize);
        return(
            <div style={this.styles.container}>
                {cardArrays.map((arr, i)=>
                       <CardSetLine
                           key={i.toString()}
                            width={this.props.width}
                            cards={arr}
                            back={this.props.back}/>

                )}
            </div>
        );
    }
}
CardSet.defaultProps = {
    height: 310,
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