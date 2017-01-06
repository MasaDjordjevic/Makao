/**
 * Created by Masa on 03-Jan-17.
 */
import React from 'react';
import Tooltip from 'material-ui/internal/Tooltip';
import transitions from 'material-ui/styles/transitions';
import mainMuiTheme from './MainMuiTheme';


function getStyles(props) {
    const baseTheme = mainMuiTheme;
    return {
        root: {
            position: 'relative',
            boxSizing: 'border-box',
            overflow: 'visible',
            transition: transitions.easeOut(),
            width: '100%',
            height: '100%',
        },
        tooltip: {
            boxSizing: 'border-box',
        },
        overlay: {
            position: 'relative',
            top: 0,
            width: '100%',
            height: '100%',
            background: baseTheme.palette.disabledColor,
        },
        disabled: {
            color: baseTheme.palette.disabledColor,
            fill: baseTheme.palette.disabledColor,
            cursor: 'not-allowed',
        },
    };
}

class DefaultTooltip extends React.Component{


    state = {
        hovered: false,
        isKeyboardFocused: false,
        // Not to be confonded with the touch property.
        // This state is to determined if it's a mobile device.
        touch: false,
        tooltipShown: false,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.disabled) {
            this.setState({hovered: false});
        }
    }

    showTooltip() {
        if (this.props.tooltip) {
            this.setState({tooltipShown: true});
        }
    }

    hideTooltip() {
        if (this.props.tooltip) this.setState({tooltipShown: false});
    }

    handleBlur = (event) => {
        this.hideTooltip();
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };

    handleFocus = (event) => {
        this.showTooltip();
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };

    handleMouseLeave = (event) => {
        if (!this.state.isKeyboardFocused) {
            this.hideTooltip();
        }
        this.setState({hovered: false});
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave(event);
        }
    };

    handleMouseOut = (event) => {
        if (this.props.disabled) this.hideTooltip();
        if (this.props.onMouseOut) this.props.onMouseOut(event);
    };

    handleMouseEnter = (event) => {
        this.showTooltip();

        // Cancel hover styles for touch devices
        if (!this.state.touch) {
            this.setState({hovered: true});
        }
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter(event);
        }
    };

    handleTouchStart = (event) => {
        this.setState({touch: true});

        if (this.props.onTouchStart) {
            this.props.onTouchStart(event);
        }
    };



    render(){
        const {
            disabled,
            hoveredStyle,
            style,
            tooltip,
            tooltipPosition: tooltipPositionProp,
            tooltipStyles,
            touch,
        } = this.props;


        const styles = getStyles(this.props, this.context);
        const tooltipPosition = tooltipPositionProp.split('-');
        if(tooltipPosition[1] === 'left') {
            tooltipPosition[1] = 'right';
        }else if(tooltipPosition[1] === 'right'){
            tooltipPosition[1] = 'left';
        }
        const hovered = this.state.hovered && !disabled;

        const mergedRootStyles = Object.assign(
            styles.root,
            hovered ? hoveredStyle : {},
            style
        );
        return(
            <div
                style={mergedRootStyles}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onMouseLeave={this.handleMouseLeave}
                onMouseEnter={this.handleMouseEnter}
                onMouseOut={this.handleMouseOut}
                onTouchStart={this.handleTouchStart}>

                <Tooltip
                    label={tooltip}
                    show={this.state.tooltipShown}
                    touch={touch}
                    style={Object.assign(styles.tooltip, tooltipStyles)}
                    verticalPosition={tooltipPosition[0]}
                    horizontalPosition={tooltipPosition[1]}
                />
                {this.props.children}
            </div>
        );

    }
};
export default DefaultTooltip;

DefaultTooltip.defaultProps = {
    disabled: false,
    disableTouchRipple: false,
    tooltipPosition: 'top-center',
    touch: false,
};

DefaultTooltip.propTypes = {
    tooltip: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    disableTouchRipple: React.PropTypes.bool,
    tooltipPosition: React.PropTypes.string,
    touch: React.PropTypes.bool,
};