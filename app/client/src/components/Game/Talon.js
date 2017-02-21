import React from 'react';
import CardComponent from '../Card/CardComponent';
import AnimateOnChange from 'react-animate-on-change';
//import styles from './talon.css';
import Card from '../Card/Card';

class Talon extends React.Component {
    constructor() {
        super();
        this.state = {
            animate: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.card !== nextProps.card &&
            (nextProps.card.number !== '12' || nextProps.card.jackSymbol !== null)) {
            this.setState({animate: true});
        } else {
            this.setState({animate: false});
        }
    }

    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            deck: {
                marginLeft: '10%',
                ':hover': {
                    cursor: 'pointer',
                }
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <AnimateOnChange
                    baseClassName="talon"
                    animationClassName="talonLarge"
                    animate={this.state.animate}>
                    <div>
                        {this.props.card ?
                            <CardComponent cardHeight={this.props.cardHeight}
                                           card={this.props.card}
                                           hover={false}/>
                            : <CardComponent cardHeight={this.props.cardHeight}
                                             back/>
                        }
                    </div>
                </AnimateOnChange>
                <div style={this.styles.deck}
                     onClick={() => this.props.onClick()}>
                    <CardComponent cardHeight={this.props.cardHeight / 1.5}
                                   back
                                   hover="pointer"/>
                </div>
            </div>
        );
    }

}
export default Talon;

Talon.propTypes = {
    card: React.PropTypes.instanceOf(Card),
    cardHeight: React.PropTypes.number,
    onClick: React.PropTypes.func,
};
