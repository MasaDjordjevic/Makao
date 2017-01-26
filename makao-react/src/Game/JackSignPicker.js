import React from 'react';
import Radium from 'radium';
import CardSymbol from '../Card/CardSymbol';

class JackSignPicker extends React.Component {
    constructor() {
        super();

        this.state = {
            hover: null
        }
    }

    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: this.props.circleSize * 1.3,
                bottom: '-' + (this.props.circleSize * 1.7) + 'px',
            },
            cardSymbol: {
                display: "block",
                border: "none",
                borderRadius: "20%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                textAlign: 'center',
                backgroundColor: 'white'
            }
        }
    }

    handleHover(sign) {
        this.setState({hover: sign});
    }

    render() {
        const circleSize = this.props.circleSize;
        const signs = ['spades', 'diamonds', 'hearts', 'clubs'];
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                {
                    signs.map((sign, i) =>
                        <div key={sign}
                             onMouseEnter={() => this.handleHover(sign)}
                             onClick={() => this.props.onPick(sign)}>
                            <CardSymbol
                                containerSize={this.state.hover == sign ? circleSize * 1.3 : circleSize}
                                style={this.styles.cardSymbol}
                                symbol={sign}
                            />
                        </div>
                    )
                }

            </div>
        );
    }
}
export default JackSignPicker;

JackSignPicker.defaultProps = {
    circleSize: 30,
};

JackSignPicker.propTypes = {
    circleSize: React.PropTypes.number,
    onPick: React.PropTypes.func,
};