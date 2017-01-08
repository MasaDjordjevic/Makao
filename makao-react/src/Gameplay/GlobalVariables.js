import React from 'react';

class GlobalVariables extends React.Component {
    constructor(){
        super();
        this.userId = 1;
        this.userName = 'Masa';
        this.handLength = 5;
    }
}
export default (new GlobalVariables);