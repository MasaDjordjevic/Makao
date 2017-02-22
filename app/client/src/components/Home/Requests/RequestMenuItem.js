import React from 'react';
import {green600, grey500} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton'
import {Link} from 'react-router';

class Request extends React.Component {
    render() {
        return (

            <MenuItem primaryText={
                <div>
                <span style={this.props.titleStyle}>{this.props.title}&nbsp;
                    <Link to={"/users/" + this.props.requester}>
                        <b>{this.props.requester}</b>
                    </Link>
                </span>
                    <div>
                        <FlatButton label="Accept" labelStyle={{color: green600}}
                                    onClick={() => this.props.onAccept(this.props.requester)}/>
                        <FlatButton label="Ignore" labelStyle={{color: grey500}}
                                    onClick={() => this.props.onIgnore(this.props.requester)}/>
                    </div>
                </div>

            }
                      rightIcon={this.props.rightIcon}
            />


        );
    }
}
export default Request;

Request.defaultProps = {
    titleStyle: {},
};

Request.propTypes = {
    titleStyle: React.PropTypes.object,
    title: React.PropTypes.string,
    requester: React.PropTypes.string,
    onAccept: React.PropTypes.func,
    onIgnore: React.PropTypes.func,
    rightIcon: React.PropTypes.any,
};