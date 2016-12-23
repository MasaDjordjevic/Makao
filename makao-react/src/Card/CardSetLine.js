/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardComponent from './CardComponent';
import {getCardWidth} from './common'

class CardSetLine extends React.Component{
    get styles(){
        const cardWidth = getCardWidth(this.props.height);
        return {
            container: {
                width: this.props.width,
                height: this.props.height,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            cardContainer: {
                width: '1px',
                height: '100%'
            },
            lastChild: {
                marginRight: cardWidth,
            }
        }
    }

    cardContainerStyle(i){
        let style = this.styles.cardContainer;
        style.zIndex = i;
        if(i === this.props.cards.length - 1) {
            style = {...style, ...this.styles.lastChild};
        }
        return style;
    }

    componentWillMount(){
        if(this.props.sort)
            this.props.cards.sort((c1, c2) => c1.number-c2.number);
    }

    render(){
        const offset = this.props.width/this.props.cards.length;
        return(
            <div style={this.styles.container}>
                {
                    this.props.cards.map((card, i) =>
                            <div
                                key={i.toString()}
                                style={this.cardContainerStyle(i)}>
                                <CardComponent
                                    cardHeight={this.props.height}
                                    card={card}
                                    offset={offset} />
                            </div>
                    )
                }
            </div>
        );
    }
}
CardSetLine.defaultProps = {
    height: 310,
};
CardSetLine.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number,

    back: React.PropTypes.bool,
    cardNumber: React.PropTypes.number,
    cards: React.PropTypes.array,
    sort: React.PropTypes.bool
};

export default CardSetLine;