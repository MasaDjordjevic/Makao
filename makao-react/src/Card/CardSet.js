/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardComponent from './CardComponent';

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
        const cardNum = this.props.back ? this.props.cardNumber : this.props.cards.length;
        const offset = this.props.width/cardNum;
        const chunkSize = 15;
        const verticalOffset = this.props.height/Math.ceil(cardNum/chunkSize);
        return(
            <div style={this.styles.container}>
                {
                    this.props.back ?
                        Array(this.props.cardNumber).fill(0).map((card, i) =>
                            <div key={i.toString()} style={{...this.styles.card, ...{left: i*offset}}}>
                                <CardComponent back cardHeight={this.props.height} />
                            </div>
                                )
                        :
                        this.props.cards.map((card, i) => {
                        return i%chunkSize === 0 ? this.props.cards.slice(i, i+chunkSize) : null;
                        }).filter(function(e){ return e; }).map((arr, index) => {
                            return arr.map((card, i) =>
                                <div
                                    key={i.toString()}
                                    style={{...this.styles.card, ...{
                                        left: i*offset,
                                        top: index*verticalOffset
                                    }}}>
                                    <CardComponent cardHeight={this.props.height} card={card} key={i.toString()} offset={offset} />
                                </div>
                            )
                        })

                }
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