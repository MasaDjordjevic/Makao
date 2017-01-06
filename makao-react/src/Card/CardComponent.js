/**
 * Created by Masa on 18-Dec-16.
 */
import React from 'react';
import Radium from 'radium';
import CardFront from './CardFront';
import CardBack from './CardBack';


class CardComponent extends React.Component {
    cardHeight() {
        return this.props.cardHeight;
    }

    render() {
        return (

            this.props.back ?
                <CardBack cardHeight={this.props.cardHeight} hover={this.props.hover}/>
                : <CardFront
                    cardHeight={this.props.cardHeight}
                    card={this.props.card}
                    offset={this.props.offset}
                    hover={this.props.hover}/>

        );
    }
}

CardComponent.defaultProps = {
    back: false
};
CardComponent.propTypes = {
    cardHeight: React.PropTypes.number.isRequired,
    hover: React.PropTypes.any,
    back: React.PropTypes.bool,
    offset: React.PropTypes.number, /*card header symbol offset*/
};

export default Radium(CardComponent);