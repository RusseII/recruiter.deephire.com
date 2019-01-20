import React, { Component } from 'react';

import { Card, Row, Icon, Input, Checkbox, Form, message } from 'antd';

import AddYTModal from './AddYTModal';

class InfoCardEditable extends React.Component {
  state = { modalVisible: false };

  toggleModalVisible = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  };

  render() {
    const { name, email } = this.props;
    const { modalVisible } = this.state;

    return (
      <Card>
        <Row>
          <Icon type="insurance" /> {name}
        </Row>
        <Row>
          <Icon type="mail" /> {email}
        </Row>
        <Row>
          <Icon type="youtube" /> <a> youtube.com/ahahhahah</a>
        </Row>
        <Row>
          <Button type="dashed" onClick={this.toggleModalVisible}>
            <Icon type="plus" /> Add Youtube Link
          </Button>
        </Row>

        <AddYTModal visable={modalVisible} toggle={this.toggleModalVisible} />
      </Card>
    );
  }
}

export default InfoCardEditable;
