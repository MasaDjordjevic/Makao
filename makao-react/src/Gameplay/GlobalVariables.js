import React from 'react';

class GlobalVariables extends React.Component {
    constructor(){
        super();
        this.userId = 1;
        this.userName = 'Masa';
        this.handLength = 5;

        this.players = [
            {id: 1, name: 'Masa'},
            {id: 2, name: 'Jajac'},
            {id: 3, name: 'Nikolica'},
            {id: 4, name: 'Nemanja'},
            {id: 5, name: 'Darko'},
            {id: 5, name: 'Marko'},
        ];
    }
}
export default (new GlobalVariables);