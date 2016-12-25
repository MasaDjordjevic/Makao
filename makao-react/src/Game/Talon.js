/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardComponent from '../Card/CardComponent';
import Transition from 'react-motion-ui-pack'


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
                <Transition
                    component={false}
                    measure={false}
                    enter={{
                        scale: 1,
                    }}
                    leave={{
                        scale: 1.2,
                    }}
                >
                    <div key={this.getKey()}>
                        {this.props.card ?
                            <CardComponent cardHeight={this.props.cardHeight}
                                           card={this.props.card}/>
                            : <CardComponent cardHeight={this.props.cardHeight} back/>
                        }
                    </div>
                </Transition>
            </div>
        );
    }

}
export default Talon;