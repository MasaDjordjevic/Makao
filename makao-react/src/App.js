import React, { Component } from 'react';
import './App.css';
import Card from './Card/Card';
import CardComponent from "./Card/CardComponent";
import CardSet from "./Card/CardSet";
import Game from "./Game/Game";

class App extends Component {
    get testCards(){
        return [
            new Card("spades", "2"),
            new Card("spades", "7"),
            new Card("diamonds", "1"),
            new Card("spades", "12"),
            new Card("spades", "13"),
            new Card("spades", "1"),
            new Card("diamonds", "2"),
            new Card("diamonds", "13"),
            new Card("clubs", "1"),
            new Card("clubs", "2"),
            new Card("clubs", "10"),
            new Card("clubs", "14"),
            new Card("hearts", "3"),
            new Card("hearts", "12"),
        ];
    }
    get style(){
        return {
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignContent:"space-around",
            flexWrap: "wrap",
            backgroundColor: "#ECEFF1"
        };
    }
    /*
     {this.testCards.map((card, i)=>
     <CardComponent
     card={card}
     key={i.toString()}
     cardHeight={310}/>
     )}
    */
  render() {
    return (
        /*<div className="App" style={this.style}>
            <Game />
        </div>*/


       <div className="App" style={this.style}>
           <CardSet width={500} cards={this.testCards} cardNumber={5} />
           <CardSet width={500} back cardNumber={5} />

       </div>

    );
  }
}



export default App;
