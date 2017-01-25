import React from 'react';
import CardComponent from '../Card/CardComponent';
import {getCardWidth} from '../Card/common';

class Logo extends React.Component {

    get startAngle(){
       return (this.props.cardNumber - 1) * 10;
    }

    get offset(){
        return Math.sin(this.startAngle * Math.PI / 180) * this.props.cardHeight;
    }
    getCardStyle(i, total) {
        return {
            position: 'absolute',
            transformOrigin: '0% 100%',
            transform: 'rotate(' + (i * 10 - this.startAngle) + 'deg)',
            left: getCardWidth(this.props.cardHeight)*0.25,
            top: -25,
        }
    }

    get styles() {
        return {
            container: {
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: this.offset + getCardWidth(this.props.cardHeight),
                height: '100%',
            }
        }
    }

    render() {
        const cardNum = this.props.cardNumber;
        return (

            <div style={{...this.styles.container, ...this.props.style}}>
                {
                    Array(cardNum).fill(null).map((_, i) =>
                        <CardComponent
                            key={i}
                            style={this.getCardStyle(i, cardNum)}
                            cardHeight={this.props.cardHeight}
                            back/>
                    )
                }
            </div>
        );
    }
}
export default Logo;

Logo.defaultProps = {
    cardHeight: 120,
    cardNumber: 4,
};

Logo.propTypes = {
    cardHeight: React.PropTypes.number,
    cardNumber: React.PropTypes.number,
};