import React, { Component } from 'react';

export default class listview extends Component {
  render() {
    return (
        <style>
            .listview
      {

        background:blue;

      }
        </style>
        <div className="listview">LISTVIEWTEXT
        { this.props.children }
      </div>
    )
  }
}
