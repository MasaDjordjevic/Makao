/**
 * Created by Masa on 18-Dec-16.
 */
import React from 'react';
import Radium from 'radium';
import CardFront from './CardFront';
import CardBack from './CardBack';



class CardComponent extends React.Component {
    cardHeight(){
        return this.props.cardHeight;
    }
    render() {
        return (
            this.props.back ?
                <CardBack cardHeight={this.props.cardHeight}/>
                : <CardFront
                    cardHeight={this.props.cardHeight}
                    card={this.props.card}
                    offset={this.props.offset}/>
        );
    }
}

CardComponent.defaultProps = {
    cardHeight: 310,
    back: false
};
CardComponent.propTypes = {
    cardHeight: React.PropTypes.number,
};

export default Radium(CardComponent);