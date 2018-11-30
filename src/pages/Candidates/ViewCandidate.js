import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactPlayer from 'react-player';

import { Card, Col, Row, Icon, Table } from 'antd';

import styles from './ViewCandidate.less';



const columns = [{
  title: 'Questions',
  dataIndex: 'question_text',
  key: 'question_text',
}];


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeQuestion: null,
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
    return this.state.candidateData[0].user_name;
  }

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
    // if (res === null) return;
    if (res == undefined) return;

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
    if ( candidateData.length === 0) {
      return ( <p>There is no data for this user, please message our support</p>);  } 


    const { response_url: responseUrl, question_text } = candidateData[activeQuestion];
    console.log(ReactPlayer.canPlay(responseUrl))
    console.log(candidateData, activeQuestion);

    return (
      <Row gutter={24}>
        <Col span={8}>
          
          <Card hoverable title="Questions">
            <Table
              showHeader={false}
              onRow={(record, index) => ({
          onClick: () => {
this.setState({activeQuestion: index})},
        })}
              rowClassName={(record, index) => index === activeQuestion ? styles.selected : ''}              
              pagination={false}
              bordered
              dataSource={candidateData}
              columns={columns}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card
            
            title={question_text}
          >
            <div className={styles.playerWrapper}>
              <ReactPlayer 
                onError={() => this.setState({ errorinVid: true })}
                preload
                controls
                playing
                // onEnded={() => this.setState({activeQuestion: activeQuestion + 1})}
                className={styles.reactPlayer}
                height="100%"
                width="100%"
                url={responseUrl}
              />
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default App;
