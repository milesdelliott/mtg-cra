import React, { Component } from 'react';
import './App.css';

var gameData = {
  players: [],
  modal: {
    active: false,
    parent: false,
    target: null
  }
}

function AddPlayerButton(props) {
  function handleClick(e) {
    e.preventDefault();
    props.onClick();
  }
  return (
    <button className={"button add-button player-button"} onClick={handleClick}>Add Player</button>
  );
}

function AddCounterButton(props) {
  function handleClick(e) {
    e.preventDefault();
    props.onClick("Copter", props.playerID);
  }
  return (
    <button role="button" className={"button add-button count-button"} onClick={handleClick}>Add Counter</button>
  );
}

function Debug(props) {
  function handleClick(e) {
    e.preventDefault();
    props.onClick();
  }
  return (
    <button role="button" onClick={handleClick}>Debug</button>
  );
}

function LifeButton(props) {
  function handleClick(e) {
    e.preventDefault();
    props.onClick(props.id);
  }
  return (
    <button role="button" className={"button player-life-button player-life-button-" + props.effectClass + " button-" + props.effectClass } onClick={handleClick}>
      {props.children}
    </button>
  );
}

function CountButton(props) {
  function handleClick(e) {
    e.preventDefault();
    props.onClick(props.id, props.playerID);
  }
  return (
    <button role="button" className={"button count-button count-button-" + props.effectClass} onClick={handleClick}>
      {props.children}
    </button>
  );
}

function Player(props) {
  function handleClick(e) {
    e.preventDefault();
    props.openModal(props.id);
  }
  return (
    <li className="player" style={{backgroundColor: props.color}}>

      <h2 className="player-name" onClick={handleClick}>{props.name}</h2>
      <section className="player-life">
        <LifeButton effectClass="add" aria-label="add life" onClick={props.addLife} {...props}>+</LifeButton><p className="player-life-value">{props.life}</p><LifeButton effectClass="minus" aria-label="minus life" onClick={props.minusLife} {...props}>-</LifeButton>
      </section>
      <ul className="counters">
        {props.counters.map((counter, i) =>
          <Counter playerID={props.id} name={counter.name} openModal={props.openModal} id={counter.id} count={counter.count} addCount={props.addCount} minusCount={props.minusCount} key={i} />
        )}
      </ul>
      <AddCounterButton onClick={props.addCounter} playerID={props.id} />
    </li>
  );
}

function Counter(props) {

  function handleClick(e) {
    e.preventDefault();
    props.openModal(props.id, true, props.playerID);
  }

  return (
    <li className="counter">
      <h3 className="counter-name" onClick={handleClick}>{props.name}</h3>
      <CountButton aria-label="add count" onClick={props.addCount} effectClass="add" {...props}>+</CountButton><p className="counter-count">{props.count}</p><CountButton effectClass="minus" onClick={props.minusCount} aria-label="minus count" {...props}>-</CountButton>
    </li>
  );
}

class Modal extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.data);
    this.state = {
      name: this.props.data.name,
      color: this.props.data.color
    }



  }

  handleClick = (e) => {
    e.preventDefault();
    this.props.saveData(this.props.target, this.state.name, this.state.color, this.props.parent);
    this.setState({name:'', color: ''});
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handleColorChange = (event) => {
    this.setState({ color: event.target.value });
  };

  debug = () => {console.log(this.props)};

  render() {

    return (
      <div className={"modal modal--" + this.props.active}>
        <input className="modal-input"
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <input className="modal-input"
          type="text"
          value={this.state.color}
          onChange={this.handleColorChange}
        />
         <button onClick={this.handleClick} className="modal-button button button-save" type="submit">Save</button>
         <Debug onClick={this.debug} />
      </div>
    );
  }
}

class App extends Component {
  constructor (props) {
    super(props);
    this.state = gameData;
    this.addPlayer = this.addPlayer.bind(this);
  }

  debug = () => {console.log(this.state)};

  addPlayer = (playerName) => {
    let newPlayers = this.state.players.concat([{
      id: this.state.players.length,
      name: this.state.players.length + 1,
      life: 20,
      alive: true,
      counters: [],
      color: ''
    }])
    this.setState({players: newPlayers});
  }

  addCounter = (counterName, playerID) => {
    let newPlayers = this.state.players;
    newPlayers[playerID].counters.push({
      id: this.state.players[playerID].counters.length,
      name: counterName,
      count: 0
    });
    this.setState({players: newPlayers});
  }

  addLife = (playerID) => {
    let newPlayers = this.state.players;
    newPlayers[playerID].life++;
    this.setState({players: newPlayers});
  }

  minusLife = (playerID) => {
    let newPlayers = this.state.players;
    newPlayers[playerID].life--;
    if (newPlayers[playerID].life <= 0) {
      this.playerDeath(playerID);
    }
    this.setState({players: newPlayers});
  }

  addCount = (counterID, playerID) => {
    let newPlayers = this.state.players;
    newPlayers[playerID].counters[counterID].count++;
    this.setState({players: newPlayers});
  }

  minusCount = (counterID, playerID) => {
    let newPlayers = this.state.players;
    newPlayers[playerID].counters[counterID].count--;
    this.setState({players: newPlayers});
  }

  playerDeath = (playerID) => {
    let newPlayers = this.state.players;
    newPlayers[playerID].alive = false;
    this.setState({players: newPlayers});
  }

  openModal = (entityID, isCounter, parentID) => {
    targetLocation =
    var newInput = {
      target: entityID,
      parent: parentID,
      active: true
    }
    this.setState({modal: newInput})
  }

  closeModal = (playerID) => {
    var newInput = {
      target: null,
      parent: false,
      active: false
    }
    this.setState({modal: newInput})
  }

  saveData = (entityID, name, color, parentID) => {
    var newInput = {
      target: entityID,
      parent: parentID,
      active: false
    }
    let newPlayers = this.state.players;
    if (!parentID) {
      newPlayers[entityID].name = name;
      newPlayers[entityID].color = color;
    } else {
      newPlayers[parentID].counters[entityID].name = name;
      newPlayers[parentID].counters[entityID].color = color;
    }

    this.setState({modal: newInput,
    players: newPlayers});
  }

  render() {
    return (
      <div className="App">
      <ol className="players">
        {this.state.players.map((player, i) =>
          <Player key={i} name={player.name} color={player.color} id={player.id} life={player.life} addLife={this.addLife} openModal={this.openModal} minusLife={this.minusLife} counters={player.counters} addCount={this.addCount} addCounter={this.addCounter} minusCount={this.minusCount} />
        )}
      </ol>
      <AddPlayerButton onClick={this.addPlayer} />
      <Debug onClick={this.debug} />
      { this.state.modal.active &&
        <Modal saveData={this.saveData} active={this.state.modal.active} target={this.state.modal.target} parent={this.state.modal.parent} data={this.state.modal.parent ? this.state.players[this.state.modal.parent].counters[this.state.modal.target] : this.state.players[this.state.modal.target]} />
      }
      </div>
    );
  }
}

export default App;
