import React, { useState, useContext } from 'react';
import { Elements } from 'react-stripe-elements';
import PricingCards from '@/components/Upgrade/PricingCards';
import UpdateStripeCard from '@/components/StripeCard/UpdateStripeCard';
import GlobalContext from '@/layouts/MenuContext';

const data = [
  {
    name: 'Recorded',
    description: 'For recruiters that want to explore upgrading the client/candidate experience',
    price: '$49/mo',
    priceLabel: 'Billed Monthly',
    type: 'purchase',

    buttonLabel: 'Start Now',
    stripePlan: 'basic-monthly-v1',

    listItems: [
      {
        content: 'One Way Interviews',
      },
      {
        content: 'Live Video Interviews',
      },
      {
        content: 'Custom Branding',
      },
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
  const globalData = useContext(GlobalContext);

  return (
    <div>
      <Elements>
        <UpdateStripeCard
          title={`Purchase ${plan.name} Plan`}
          okText="Purchase Now"
          body={
            <div>
              You will be charged <b>{plan.price}</b> once your trial ends.
            </div>
          }
          visible={visible}
          setVisible={setVisible}
          setReload={globalData.reloadProductAndSubscriptions}
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
