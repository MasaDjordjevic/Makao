/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
};
class Opponents extends React.Component{
    get total(){
        return 8;
    }
    getEllipseLength(rx, ry) {
        let h = Math.pow((rx-ry), 2) / Math.pow((rx+ry), 2);
        return (Math.PI * ( rx + ry )) * (1 + ( (3 * h) / ( 10 + Math.sqrt( 4 - (3 * h) )) ));
    };
    get elementWidth(){
        const arc = this.getEllipseLength(window.innerWidth/2, window.innerHeight/2)/2;
        return arc/this.total;
    }
    getStyles(i){
        const angleDiff = 180/(this.total-1);
        const startAngle = 180;
        const angle = startAngle - angleDiff*i;
        const top = 50 - 50*Math.sin(angle.toRad()) + '%';
        const leftNum = Math.round(50 - 50*Math.cos(angle.toRad()));
        const left =  leftNum > 50 ? 'calc('+leftNum + '% - ' + this.elementWidth + 'px)' :leftNum + '%';

        return {
            position: 'absolute',
            backgroundColor: 'red',
            width: this.elementWidth,
            height: 20,
            top: top,
            left: left,
            transform: 'rotate(' + 0 + 'deg)',
        }
    }
    render(){
        const arr = Array(this.total).fill(null);
        return(
            <div style={{
                width: '900px',
                height: '100vh',
                position: 'relative',
                backgroundColor: 'blue'
            }}>
                {
                    arr.map((a, i) =>
                        <div key={i.toString()} style={this.getStyles(i)}>
                        </div>
                    )
                }
            </div>
        );
    }
}
export default Opponents;