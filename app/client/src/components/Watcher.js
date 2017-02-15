import React from 'react';
import Auth from '../Auth';

class Watcher extends React.Component {
    constructor(){
        super();
        this.state = {
            response: {},
        }
    }

    get styles() {
        return {
            container: {}
        }
    }

    componentDidMount(){
        fetch('/game/watch', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + Auth.getToken()
            },
            method: "POST",
            body: JSON.stringify({creatorUsername: this.props.params.username})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            debugger;
            this.setState({response: data});
        })
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>

            </div>
        );
    }
}
export default Watcher;

Watcher.defaultProps = {};

Watcher.propTypes = {};