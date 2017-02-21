import React from 'react';
import {redColor, blackColor} from './Card/common';

class PageNotFound extends React.Component {
    get styles() {
        const height = 200;
        const width = 100;
        const half = {
            width: '100%',
            height: height / 2,
        };
        return {
            container: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            },
            four0four: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 3.6 * width,
            },
            zero: {
                height: height,
                width: width,
                borderRadius: '50%',
                boxSizing: 'border-box',
            },
            zeroUpper: {
                ...half, ...{
                    backgroundColor: redColor,
                    borderRadius: '50% 50% 0 0',
                }
            },
            zeroLower: {
                ...half, ...{
                    backgroundColor: blackColor,
                    borderRadius: '0 0 50% 50%',
                }
            },
            four: {
                color: blackColor,
                fontSize: '240px',
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
                <div style={this.styles.four0four}>
                    <span style={this.styles.four}>4</span>
                    <div style={this.styles.zero}>
                        <div style={this.styles.zeroUpper}></div>
                        <div style={this.styles.zeroLower}></div>
                    </div>
                    <span style={this.styles.four}>4</span>
                </div>
                <div style={this.styles.message}>
                    <span style={this.styles.messageText}>Sorry. We couldn't find that page :(</span>
                </div>
            </div>
        );
    }
}
export default PageNotFound;

PageNotFound.defaultProps = {};

PageNotFound.propTypes = {};