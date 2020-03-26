/* global $crisp */

import React from 'react';

import { Card, Button, Typography, List, Row, Col, Icon, Tooltip } from 'antd';

const { Title } = Typography;

const Items = ({ listItems }) => (
  <List
    style={{ textAlign: 'left' }}
    header={null}
    footer={null}
    dataSource={listItems}
    renderItem={item => (
      <li style={{ marginTop: 8 }}>
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{ margin: 8 }} />
        {item.content}
        {item.tooltip ? (
          <Tooltip title={item.tooltip}>
            <Icon style={{ margin: 8 }} type="question-circle" theme="filled" />
          </Tooltip>
        ) : null}
      </li>
    )}
  />
);

const contact = () => {
  $crisp.push(['do', 'chat:open']);
  $crisp.push(['do', 'message:send', ['text', "Hi, I'm interested in other plans."]]);
};

const Cards = ({ data, onClick }) => {
  return (
    <Row type="flex" gutter={[24, 8]} justify="center">
      {data.map(plan => {
        const { name, price, priceLabel, buttonLabel, description, listItems, type } = plan;
        return (
          <Col>
            <Card style={{ textAlign: 'center', width: 300 }}>
              <Title level={4}>{name}</Title>
              <p>{description}</p>
              <Title level={2}>{price}</Title>
              <p>{priceLabel}</p>
              <Button
                style={{ marginBottom: 48 }}
                shape="round"
                block
                size="large"
                type="primary"
                onClick={type === 'contact' ? contact : () => onClick(plan)}
              >
                {buttonLabel}
              </Button>
              <Items listItems={listItems} />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default Cards;
