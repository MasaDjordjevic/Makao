/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardComponent from '../Card/CardComponent';
import AnimateOnChange from 'react-animate-on-change';
import styles from './talon.css';

    class Talon extends React.Component {
    get styles(){
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
            <div style={this.styles.container}>
                <AnimateOnChange
                    baseClassName="test"
                    animationClassName="testLarge"
                    animate={this.props.card != null}>
                    <div>
                        {this.props.card ?
                            <CardComponent cardHeight={this.props.cardHeight}
                                           card={this.props.card} hover={false}/>
                            : <CardComponent cardHeight={this.props.cardHeight} back/>
                        }
                    </div>
                </AnimateOnChange>
                <div style={this.styles.deck} onClick={()=>this.props.onClick()}>
                    <CardComponent cardHeight={this.props.cardHeight/1.5} back hover="pointer"/>
                </div>
            </div>
        );
    }

}
export default Talon;