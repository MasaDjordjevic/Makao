/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react'
import CardComponent from '../Card/CardComponent';

class Talon extends React.Component {

    render(){
        return(
            <div>
                {this.props.card ?
                    <CardComponent cardHeight={this.props.cardHeight} card={this.props.card}/>
                    : <CardComponent cardHeight={this.props.cardHeight} back/>
                }
            </div>
        );
    }

}
export default Talon;