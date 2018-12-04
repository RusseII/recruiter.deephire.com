import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactPlayer from 'react-player';

import { Card, Col, Row, Icon, Table, Button } from 'antd';

import styles from './ViewCandidate.less';

const columns = [
  {
    title: 'Questions',
    dataIndex: 'question_text',
    key: 'question_text',
  },
];

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
    this.setState({ id, userToken });
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

  openInterview = () => {
    // const { company_id, user_id } = data;
    // const {$oid} = _id
    // console.log($oid)
    const url = `https://candidates.deephire.com/?id=${this.state.id}&candidate=${
      this.state.userToken
    }`;

    window.open(url, '_blank');
  };

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
    if (candidateData.length === 0) {
      return <p>There is no data for this user, please message our support</p>;
    }

    const { response_url: responseUrl, question_text } = candidateData[activeQuestion];
    console.log(ReactPlayer.canPlay(responseUrl));
    console.log(candidateData, activeQuestion);

    return (
      <Row gutter={24}>
        <Col span={8}>
          <Card
            style={{marginBottom: "20px"}}
            hoverable
            title="Russell Ratcliffe"
            actions={[
              <Button shape="circle" icon="setting" />,
              <Button onClick={() => this.openInterview()} shape="circle" icon="share-alt" />,
            ]}
          >
          GMS Sales Interview
          Russell@deephire.com
          </Card>
          
          <Card hoverable title="Questions">
            <Table
              showHeader={false}
              onRow={(record, index) => ({
                onClick: () => {
                  this.setState({ activeQuestion: index });
                },
              })}
              rowClassName={(record, index) => (index === activeQuestion ? styles.selected : '')}
              pagination={false}
              bordered
              dataSource={candidateData}
              columns={columns}
            />
          
          </Card>
          
        </Col>
        <Col span={16}>
          {/* <Button shape="circle" icon="search" /> */}
          <Card
            title={question_text}
            actions={[
              <Button shape="circle" icon="setting" />,
              <Button onClick={() => this.openInterview()} shape="circle" icon="share-alt" />,
            ]}
          >
            {/* // actions={[<Icon type="setting" />, <Icon type="share-alt" />]} */}
            <div className={styles.playerWrapper}>
              <ReactPlayer
                onError={() =>
                  this.setState({
                    errorinVid: true,
                  })
                }
                preload
                controls
                playing
                className={
                  styles.reactPlayer // onEnded={() => this.setState({activeQuestion: activeQuestion + 1})}
                }
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
