import React from 'react';

class GlobalVariables extends React.Component {
    constructor(){
        super();
        console.log("global variables constructor");
        this.userId = 1;
    }
}
export default new GlobalVariables;