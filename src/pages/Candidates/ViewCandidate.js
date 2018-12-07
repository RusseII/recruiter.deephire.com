import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactPlayer from 'react-player';

import { Card, Col, Row, Icon, Table, Button } from 'antd';
import router from 'umi/router';


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
    const {candidateData} = this.state;
    return candidateData[0].user_name;
  }

  nextQuestion = () => {
    const {activeQuestion, candidateData} = this.state;

    if (activeQuestion + 1 < candidateData.length){
    this.setState({activeQuestion: activeQuestion + 1});
    }
  }


  previousQuestion = () => {
    const {activeQuestion} = this.state;
    console.log(activeQuestion)
    if (activeQuestion > 0 ){
    this.setState({activeQuestion: activeQuestion - 1});
    }
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


  goToCandidates = () => {
    router.push(`/candidates/candidates`);

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

    const { response_url: responseUrl, question_text, candidate_email, interview_name } = candidateData[activeQuestion];
    console.log(ReactPlayer.canPlay(responseUrl));
    console.log(candidateData, activeQuestion);

    return(
      <div>
        <Button
          style={{marginBottom: "20px"
        }}
          onClick={this.goToCandidates}
          type="secondary"
        >
          <Icon type="left" />Back to Candidates
        </Button>

        <Button
          style={{float: "right", marginLeft: "20px",marginBottom: "20px"
        }}
          shape="circle"
          icon="setting"
        />
        <Button
          style={{float: "right", marginBottom: "20px"
        }}
          onClick={this.openInterview}
          type="primary"
        >
       

           Share Candidate
          <Icon type="share-alt" />
        </Button>

     
        <Row gutter={24}>
          <Col span={8}>
            <Card style={{ marginBottom: '20px' }} hoverable title={candidateData[0].user_name}> 
              <Icon type="insurance"  /> {interview_name}<br />

              <Icon type="mail"  /> {candidate_email}
            
            </Card>

            <Card hoverable title="Questions">
              <Table
                showHeader={false}
                onRow={(record, index) => ({ onClick: () => {
                  this.setState({ activeQuestion: index });
                } })}
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
            <Card title={question_text} actions={[<Button shape="circle" icon="left" onClick={this.previousQuestion} />, <Button onClick={this.nextQuestion} shape="circle" icon="right" />]}>
              {/* // actions={[<Icon type="setting" />, <Icon type="share-alt" />]} */}
              <div className={styles.playerWrapper}>
                <ReactPlayer
                  onError={() => this.setState({
                    errorinVid: true,
                  })}
                  preload
                  controls
                  playing
                  className={styles.reactPlayer // onEnded={() => this.setState({activeQuestion: activeQuestion + 1})}
                }
                  height="100%"
                  width="100%"
                  url={responseUrl}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>);
  }
}

export default App;
