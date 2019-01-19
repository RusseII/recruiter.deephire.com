import React, { Component } from 'react';

import { Card, Col, Row, Icon, Table, Button, Modal, Input, Checkbox, Form, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { connect } from 'dva';
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
          <Icon type="mail" /> {email}{' '}
        </Row>
        <Row>
          <Icon type="youtube" /> <a> youtube.com/ahahhahah</a>
        </Row>
        <Button type="dashed" onClick={this.toggleModalVisible}>
          <Icon type="plus" /> Add Youtube Link
        </Button>
        <AddYTModal visable={modalVisible} toggle={this.toggleModalVisible} />
      </Card>
    );
  }
}

export default InfoCardEditable;
