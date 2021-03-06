import { PUSH_NOTIFICATION } from '../constants/browserConstants';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { push } from 'react-router-redux';

import { GamePage } from '../components/';
import { GET_ALL_USERS, UPDATE_USERS, GET_QUESTION, CLEAR_ALL_STATE, GET_OUT_OF_CONTEST, NEXT_CONTEST } from '../constants/index';

class GameContainer extends Component {

  socket = io('http://127.0.0.1:4000')
  state = {
    isLoading: false,
  }

  componentDidMount() {
    const that = this;
    const { dispatch } = this.props;

    dispatch({ type: GET_ALL_USERS });

    this.socket.on('score', (allUsers) => {
      dispatch({ type: UPDATE_USERS, payload: { allUsers }});
    });


    // start next question
    this.socket.on('push notification', ({ option, id }) => {
        dispatch({ type: GET_QUESTION, payload: { option, id } });
    });

    //  start next game
    this.socket.on('next contest', (msg) => {
      dispatch({ type: CLEAR_ALL_STATE });
    });
  }

  handleSelect = (option) => {
    const { dispatch } = this.props;

    dispatch({ type: PUSH_NOTIFICATION, payload: { option }});
  }

  handleRes = (type, token, remainAudience) => {
    const { dispatch, players } = this.props;
    dispatch({ type: GET_OUT_OF_CONTEST, payload: { token, type, remainAudience, playersLength: players.length } });
  }

  handleNextContest = () => {
    const { dispatch } = this.props;
    dispatch(push('/dash_board'));
  }

  render() {
    const { players, allUsers, question } = this.props;
    return(
      <GamePage
        players={players}
        allUsers={allUsers}
        isLoading={this.state.isLoading}
        question={question}
        handleSelect={this.handleSelect}
        handleRes={this.handleRes}
        handleNextContest={this.handleNextContest}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { players, allUsers } = state.user;
  const { question } = state.question;

  return {
    players,
    allUsers,
    question
  };
};

export default connect(mapStateToProps, null)(GameContainer);