import React from 'react';
import {redColor, blackColor} from './Card/common';

class NoAccess extends React.Component {
    get styles() {
        const height = 110;
        const width = 70;
        const half = {
            width: '100%',
            height: height / 2,
        };
        const halfBorderRadius = (width/2) + 'px';
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            },
            main: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
            zero: {
                height: height,
                width: width,
                borderRadius: '50%',
                backgroundColor: 'red',
                boxSizing: 'border-box',
                marginRight: width/2,
            },
            zeroUpper: {
                ...half, ...{
                    backgroundColor: redColor,
                    borderRadius: halfBorderRadius + ' ' + halfBorderRadius +' 0 0',
                }
            },
            zeroLower: {
                ...half, ...{
                    backgroundColor: blackColor,
                    borderRadius: '0 0 ' + halfBorderRadius + ' ' + halfBorderRadius,
                }
            },
            rightText: {
                color: blackColor,
                fontSize: (height*1.3) + 'px',
                fontFamily: 'Dosis'
            },
            message: {
                padding: '16px',
            },
            messageText: {
                color: blackColor,
                fontSize: '24px',
            }

        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.main}>
                    <span style={this.styles.rightText}>N</span>
                    <div style={this.styles.zero}>
                        <div style={this.styles.zeroUpper}>
                        </div>
                        <div style={this.styles.zeroLower}>
                        </div>
                    </div>
                    <span style={this.styles.rightText}>ACCESS</span>
                </div>
                <div style={this.styles.message}>
                    <span style={this.styles.messageText}>{this.props.message}</span>
                </div>
            </div>
        );
    }
}
export default NoAccess;

NoAccess.defaultProps = {
    message: "Sorry. You don't have access to this page :(",
};

NoAccess.propTypes = {
    message: React.PropTypes.string,
};