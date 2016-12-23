/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import CardSet from '../Card/CardSet';

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
};

class Opponents extends React.Component{

    getStyles(i){
        const angleDiff = 180/(this.total + this.total%2 -1);
        const startAngle = 180;
        let angle = startAngle - angleDiff*(i+this.total%2);
        if(this.total%2 === 1){
            if(i<Math.floor(this.total/2))
                angle+= angleDiff;
            if(i==Math.floor(this.total/2))
                angle += angleDiff/this.total;
        }else {
            if( i == this.total/2 - 1)
            {
                angle+= angleDiff/4;
            }
            else if( i == this.total/2)
            {
                angle-= angleDiff/4;

            }

        }

        console.log(angle);
        const top = 50 - 50*Math.sin(angle.toRad()) + '%';
        const leftNum = Math.round(50 - 50*Math.cos(angle.toRad()));
        const left =  leftNum > 50 ? 'calc('+leftNum + '% - ' + this.elementWidth + 'px)' :leftNum + '%';

        return {
            position: 'absolute',
            width: this.elementWidth,
            top: top,
            left: left,
        }
    }
    get total(){
        var a = this.props.players.length;
        return a;
    }
    getEllipseLength(rx, ry) {
        let h = Math.pow((rx-ry), 2) / Math.pow((rx+ry), 2);
        return (Math.PI * ( rx + ry )) * (1 + ( (3 * h) / ( 10 + Math.sqrt( 4 - (3 * h) )) ));
    };

    get elementWidth(){
        return  this.props.playerHeight/3*4 ;
        /*if(this.props.players.length > 8){
            retVal = retVal*this.props.players.length/20;
        }
        return retVal*/
        const arc = this.getEllipseLength(window.innerWidth/2, window.innerHeight/2)/2;
        return arc/this.total;
    }
    render(){
        const players = this.props.players;
        const width = this.elementWidth;
        let height = this.props.playerHeight;
        if(players.length > 8)
            height = height*players.length/11;
        if(players.length > 10)
            height = height*players.length/15;
        return(
            <div style={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
            }}>
                {
                    players.map((player, i) =>
                        <div key={i.toString()} style={this.getStyles(i)}>
                            <CardSet height={height} width={width} back cardNumber={+player.cardNumber}/>
                        </div>
                    )
                }
            </div>
        );
    }
}

Opponents.propTypes = {
    players: React.PropTypes.array.isRequired,
    playerHeight: React.PropTypes.number,
}

export default Opponents;