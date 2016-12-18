import React, { Component } from 'react';
import './App.css';
import Card from "./Card"

class App extends Component {
  render() {
      const appStyle = {
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignContent:"space-around",
          flexWrap: "wrap",
          backgroundColor: "#ECEFF1"
      }
      const testCards = [
          {sym:"spades", num: "2" },
          {sym:"spades", num: "7" },
          {sym:"diamonds", num: "1" },
          {sym:"spades", num: "12" },
          {sym:"spades", num: "13" },
          {sym:"spades", num: "1" },

          {sym:"diamonds", num: "2" },
          {sym:"diamonds", num: "13" },
          {sym:"clubs", num: "1" },
          {sym:"clubs", num: "2" },
          {sym:"clubs", num: "10" },
          {sym:"clubs", num: "14" },
          {sym:"hearts", num: "3" },
          {sym:"hearts", num: "12" },
      ];
    return (
      <div className="App" style={appStyle}>
          {testCards.map((card, i)=>
                <Card symbol={card.sym} number={card.num} key={i.toString()}/>
          )}
      </div>
    );
  }
}

export default App;
