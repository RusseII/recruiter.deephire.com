import React, { useState } from 'react';
import { Elements } from 'react-stripe-elements';
import PricingCards from '@/components/Upgrade/PricingCards';
import CheckoutForm from '@/components/StripeCard/UpdateStripeCard';

const data = [
  {
    name: 'Starter',
    description: 'For recruiters that want to explore upgrading the client/candidate experience',
    price: '$199/mo',
    priceLabel: 'Billed Monthly',
    type: 'purchase',

    buttonLabel: 'Start Now',
    stripePlan: 'basic-monthly-v1',

    listItems: [
      {
        content: '2 Jobs',
        tooltip: 'This is the number of positions you can actively interview for each month',
      },
      {
        content: '10 User Seats',
      },
      {
        content: '500 Candidates',
      },
      {
        content: 'Custom branding',
      },
      {
        content: 'Onboarding session',
      },
      {
        content: 'Chat and phone support',
      },
    ],
  },
  {
    name: 'Professional',
    description:
      'For recruiters that are serious about improving their client/candidate experience',
    price: 'Contact Us',
    priceLabel: 'Flexible Plans',
    buttonLabel: 'Contact Us',
    type: 'contact',
    stripePlan: 'basic-monthly-v1',

    listItems: [
      {
        content: 'Unlimited Jobs',
        tooltip: 'This is the number of positions you can actively interview for each month',
      },
      {
        content: 'Unlimited User Seats',
      },
      {
        content: 'Unlimited Candidates',
      },
      {
        content: 'Enchanced branding',
      },
      {
        content: 'Dedicated account manager',
      },
      {
        content: 'Advanced ATS integrations',
      },
    ],
  },
];

const Upgrade = () => {
  const [visible, setVisible] = useState(false);
  const [plan, setPlan] = useState('');
  return (
    <div>
      <Elements>
        <CheckoutForm
          title={`Purchase ${plan.name} Plan`}
          okText="Purchase Now"
          body={
            <div>
              You will be charged <b>{plan.price}</b> once your trial ends.
            </div>
          }
          visible={visible}
          setVisible={setVisible}
        />
      </Elements>
      <PricingCards
        onClick={plan => {
          setPlan(plan);
          setVisible(true);
        }}
        data={data}
      />
    </div>
  );
};

export default Upgrade;
