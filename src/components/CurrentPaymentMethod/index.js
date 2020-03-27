/* global $crisp */
import React, { useState, useEffect, useContext } from 'react';
// import { injectStripe, CardElement } from 'react-stripe-elements';
import { Row, Col } from 'antd';
import Cards from 'react-credit-cards';
import readableTime from 'readable-timestamp';
import { getSubscriptions, getPaymentMethods } from '@/services/api';
import CheckoutForm from '@/components/StripeCard/UpdateStripeCard';

import 'react-credit-cards/es/styles-compiled.css';
import GlobalContext from '@/layouts/MenuContext';

import styles from './index.less';

const cancelSubscription = () => {
  $crisp.push(['do', 'chat:open']);
  $crisp.push(['do', 'message:send', ['text', "Hi, I'm interested in canceling my subscription."]]);
};

const mockPaymentData = {
  billing_details: { name: '' },
  card: { brand: '', exp_month: '', exp_year: '', last4: '' },
};
const CurrentPaymentMethod = () => {
  const [visible, setVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(mockPaymentData);
  const [subscription, setSubscription] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [reload, setReload] = useState(false);
  const globalData = useContext(GlobalContext);
  const { name: productName } = globalData?.stripeProduct || {};

  useEffect(() => {
    const getData = async () => {
      const subscriptions = await getSubscriptions();
      const paymentMethods = await getPaymentMethods();
      const singleSubscription = subscriptions?.data?.[0] || {};
      setSubscription(singleSubscription);
      const { default_payment_method: defaultPaymentMethod } = singleSubscription;
      let currentMethod = paymentMethods?.data;
      if (currentMethod) {
        if (defaultPaymentMethod) {
          currentMethod = currentMethod.find(method => method.id === defaultPaymentMethod);
          setPaymentMethod(currentMethod);
        } else {
          setPaymentMethod(currentMethod[0]);
        }
      }
    };

    getData();
  }, [reload]);

  const { current_period_end: periodEnds, plan } = subscription || {};
  const { amount, interval } = plan || {};

  let renewsOn = '';
  if (periodEnds) {
    const dateObj = new Date(periodEnds * 1000);
    renewsOn = readableTime(dateObj, { format: 'absolute-full' });
  }

  // eslint-disable-next-line camelcase
  const { name } = paymentMethod?.billing_details || {};
  const { brand, exp_month: expMonth = '', exp_year: expYear = '', last4 } =
    paymentMethod?.card || {};
  const month = expMonth.toString().length === 1 ? `0${expMonth}` : expMonth;

  return (
    <Row style={{ marginBottom: 100 }} type="flex" justify="start">
      <>
        <Col className={styles.spacing} style={{ fontWeight: 500 }}>
          <div>Your plan:</div>
          <div>Pricing</div>
          <div>Renews on:</div>
          <a onClick={() => setVisible(true)}>{last4 ? 'Update Card' : 'Add Card'}</a>
          <div>
            <CheckoutForm
              title="Enter new card"
              body="Update your billing method with a new card"
              okText="Update card"
              setReload={setReload}
              visible={visible}
              setVisible={setVisible}
            />
          </div>
          <a onClick={cancelSubscription}>Cancel Subscription</a>
        </Col>
        <Col className={styles.spacing} style={{ marginLeft: 16 }}>
          <div>{`${productName || 'DeepHire Trial'}`}</div>
          <div>{amount ? `$${amount / 100}/${interval}` : ''}</div>
          <div>{`${renewsOn}`}</div>
        </Col>
        <Col style={{ width: 290, marginLeft: 64 }}>
          <Cards
            issuer={brand}
            preview
            cvc={null}
            expiry={`${month}${expYear}`}
            focused=""
            name={name}
            number={`************${last4}`}
          />
        </Col>
      </>
    </Row>
  );
};

export default CurrentPaymentMethod;
