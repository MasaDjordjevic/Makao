/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardComponent from '../Card/CardComponent';
import Transition from 'react-motion-ui-pack';
import AnimateOnChange from 'react-animate-on-change';
import styles from './talon.css';

class Talon extends React.Component {
    getKey() {
        if (!this.props.card)
            return "back";
        const card = this.props.card;
        return card.number + card.symbol
    }

    render() {
        return (
            <div>
                <AnimateOnChange
                    baseClassName="test"
                    animationClassName="testLarge"
                    animate={this.props.card != null}>
                    <div key={this.getKey()}>
                        {this.props.card ?
                            <CardComponent cardHeight={this.props.cardHeight}
                                           card={this.props.card}/>
                            : <CardComponent cardHeight={this.props.cardHeight} back/>
                        }
                    </div>
                </AnimateOnChange>
            </div>
        );
    }

}
export default Talon;