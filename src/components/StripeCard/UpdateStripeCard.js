// CheckoutForm.js
import React, { useState } from 'react';
import { injectStripe, CardElement } from 'react-stripe-elements';
import { Spin, Alert, Modal } from 'antd';
import { cardWallet, addPaymentMethod } from '@/services/api';
// import AddressSection from './AddressSection';
// import CardSection from './CardSection';

const style = {
  base: {},
  marginBottom: 10,
};

const CheckoutForm = props => {
  const { setReload, title, body, okText, visible, setVisible } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [visible, setVisible] = useState(false);

  const handleSubmit = async ev => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();
    setLoading(true);
    // Use Elements to get a reference to the Card Element mounted somewhere
    // in your <Elements> tree. Elements will know how to find your Card Element
    // becase only one is allowed.
    // See our getElement documentation for more:
    // https://stripe.com/docs/stripe-js/reference#elements-get-element
    // console.log('w');
    const cardElement = props.elements.getElement('card');

    // From here we cal call createPaymentMethod to create a PaymentMethod
    // See our createPaymentMethod documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-payment-method
    // props.stripe
    //   .createPaymentMethod({
    //     type: 'card',
    //     card: cardElement,
    //     billing_details: { name: 'Jenny Rosen' },
    //   })
    //   .then(({ paymentMethod }) => {
    //     console.log('Received Stripe PaymentMethod:', paymentMethod);
    //   });

    // You can also use confirmCardPayment with the PaymentIntents API automatic confirmation flow.
    // See our confirmCardPayment documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-confirm-card-payment
    // props.stripe.confirmCardPayment('{PAYMENT_INTENT_CLIENT_SECRET}', {
    //   payment_method: {
    //     card: cardElement,
    //   },
    // });

    // // You can also use confirmCardSetup with the SetupIntents API.
    // // See our confirmCardSetup documentation for more:
    // // https://stripe.com/docs/stripe-js/reference#stripe-confirm-card-setup
    // props.stripe.confirmCardSetup('{PAYMENT_INTENT_CLIENT_SECRET}', {
    //   payment_method: {
    //     card: cardElement,
    //   },
    // });
    const { clientSecret } = await cardWallet();
    // console.log('wtf', cardElement);
    props.stripe
      .confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          // billing_details: { name: 'cardholderName.value' },
        },
      })
      .then(async result => {
        if (result.error) {
          setLoading(false);
          setError(result.error.message);
          // Display error.message in your UI.
        } else {
          setError(null);
          await addPaymentMethod(result.setupIntent.payment_method, 'Card successfully updated');
          setLoading(false);
          setVisible(false);
          if (setReload) {
            setReload(flag => !flag);
          }

          // The setup has succeeded. Display a success message.
        }
      });

    // You can also use createToken to create tokens.
    // See our tokens documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-token
    // With createToken, you will not need to pass in the reference to
    // the Element. It will be inferred automatically.
    props.stripe.createToken({ type: 'card', name: 'Jenny Rosen' });
    // token type can optionally be inferred if there is only one Element
    // with which to create tokens
    // props.stripe.createToken({name: 'Jenny Rosen'});

    // You can also use createSource to create Sources.
    // See our Sources documentation for more:
    // https://stripe.com/docs/stripe-js/reference#stripe-create-source
    // With createSource, you will not need to pass in the reference to
    // the Element. It will be inferred automatically.
    // props.stripe.createSource({
    //   type: 'card',
    //   owner: {
    //     name: 'Jenny Rosen',
    //   },
    // });
  };

  return (
    <>
      <Modal
        title={title}
        okText={okText}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        visible={visible}
      >
        <div style={{ marginBottom: 20 }}> {body}</div>

        <form onSubmit={handleSubmit}>
          <Spin spinning={loading}>
            <div className="ant-input" style={{ paddingTop: 6 }}>
              <CardElement style={style} />
            </div>
          </Spin>
          {error && (
            <Alert style={{ marginTop: 16, textAlign: 'center' }} message={error} type="error" />
          )}
        </form>
      </Modal>
      {/* <a onClick={() => setVisible(true)}>Change Card</a> */}
    </>
  );
};

export default injectStripe(CheckoutForm);
