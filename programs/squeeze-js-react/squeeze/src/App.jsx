



import React, { Component } from 'react';

import objectArrayBuilder from "./objectArrayBuilder.js";

import ReactDOM from 'react-dom';

class App extends Component
{

render()
{

  return  ReactDOM.render(<objectArrayBuilder />, document.getElementById('root'));

}

}

export default App;