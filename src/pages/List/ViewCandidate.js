import React, { Component } from 'react';
// import logo from './img/logos/horizontalresize.png';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import { Card, Col, Row, Icon } from 'antd';

import styles from './ViewCandidates.less';

// import QuestionList from './QuestionList';
// import "video-react/dist/video-react.css"; // import css for video player

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeQuestion: null,
      modal: false,
      comments: [],
    };
  }

  componentDidMount() {
    const id = this.CleanVariable(this.GetURLParameter('id'));
    const userToken = this.CleanVariable(this.GetURLParameter('candidate'));

    // var url = "https://localhost:3001/v1.0/get_candidate_videos/";
    const url = 'https://api.deephire.com/v1.0/get_candidate_videos/';

    fetch(`${url + id}/${userToken}`)
      .then(results => results.json())
      .then(
        data => {
          this.setState({
            candidateData: data,
            activeQuestion: 0,
          });
        },
        () => {
          this.setState({
            requestFailed: true,
          });
        }
      );
  }

  getName() {
    console.log('getName all data', this.state.candidateData);

    return this.state.candidateData[0].user_name;
  }

  // toggle signup email modal
  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  // pull URL GET parameters
  GetURLParameter(sParam) {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
      const sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
    return null;
  }

  // find %20, %40 in a string and replaces with a ' ' and '@' respectively
  CleanVariable(res) {
    if (res === undefined) return;

    var res = res.replace(/%20/g, ' ');
    var res = res.replace(/%40/g, '@');
    return res;
  }

  render() {
    const { candidateData, comments, activeQuestion, requestFailed } = this.state;
    if (!candidateData) return <p>Loading...</p>;
    if (comments === null) return <p> Loading! </p>;
    if (activeQuestion === null) return <p> Loading questions... </p>;
    if (requestFailed) return <p>Failed!</p>;

    return (
      <div>
        <Row gutter={24}>
          <Col span={8}>
            {' '}
            <Card hoverable title="Questions" />
          </Col>
          <Col span={16}>
            <Card
              actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="share-alt" />]}
              title="Card title"
            >
              <div className={styles.playerWrapper}>
                <ReactPlayer
                  onError={() => this.setState({ errorModal: true })}
                  preload
                  controls
                  className={styles.reactPlayer}
                  height="100%"
                  width="100%"
                  url={this.state.candidateData[this.state.activeQuestion].response_url}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
