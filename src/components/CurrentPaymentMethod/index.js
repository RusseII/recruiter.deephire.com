// CheckoutForm.js
import React, { useState, useEffect, useContext } from 'react';
// import { injectStripe, CardElement } from 'react-stripe-elements';
import { Row, Col } from 'antd';
import Cards from 'react-credit-cards';
import readableTime from 'readable-timestamp';
import { getSubscriptions, getPaymentMethods } from '@/services/api';
// import CheckoutForm from '@/components/CheckoutForm';

import 'react-credit-cards/es/styles-compiled.css';
import GlobalContext from '@/layouts/MenuContext';

import styles from './index.less';

const mockPaymentData = {
  billing_details: { name: '' },
  card: { brand: '', exp_month: '', exp_year: '', last4: '' },
};
const CurrentPaymentMethod = () => {
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
        currentMethod = currentMethod.find(method => method.id === defaultPaymentMethod);
        setPaymentMethod(currentMethod);
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
  const month = expMonth.length === 1 ? `0${expMonth}` : expMonth;

  return (
    <Row style={{ marginBottom: 100 }} type="flex" justify="start">
      <>
        <Col style={{ width: 290 }}>
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
        <Col className={styles.spacing} style={{ fontWeight: 500, marginLeft: 32 }}>
          <div>Your plan:</div>
          <div>Pricing</div>
          <div>Renews on:</div>
          {/* <CheckoutForm /> */}
        </Col>
        <Col className={styles.spacing} style={{ marginLeft: 16 }}>
          <div>{`${productName || ''}`}</div>
          <div>{amount ? `$${amount / 100}/${interval}` : ''}</div>
          <div>{`${renewsOn}`}</div>
        </Col>
      </>
    </Row>
  );
};

export default CurrentPaymentMethod;
