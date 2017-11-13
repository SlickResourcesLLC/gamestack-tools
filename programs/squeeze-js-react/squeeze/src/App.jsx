
import React, { Component } from 'react';

import objectArrayBuilder from "./listview.js";

import ReactDOM from 'react-dom';

class App extends Component
{

render()
{
  return  ReactDOM.render(<listview />, document.getElementById('root'));
}

}

export default App;