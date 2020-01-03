import React, { useState, useEffect } from 'react';
import { Icon, Table, Spin } from 'antd';
import readableTime from 'readable-timestamp';
import { gold } from '@ant-design/colors';
import { Elements } from 'react-stripe-elements';
import CurrentPaymentMethod from '@/components/CurrentPaymentMethod';

import { getInvoices } from '@/services/api';

const Billing = () => {
  const [invoices, setInvoices] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [reload, setReload] = useState(false);

  const columnsTeam = [
    {
      title: 'Status',
      render: (text, data) => {
        const { status } = data;
        let iconColor;
        let icon;
        // const status = 'draft';

        if (status === 'draft') {
          icon = 'clock-circle';
          iconColor = '#1890FF';
        }

        if (status === 'open') {
          icon = 'warning';
          // eslint-disable-next-line prefer-destructuring
          iconColor = gold[6];
        }

        if (status === 'paid') {
          iconColor = '#52c41a';
          icon = 'check-circle';
        }

        if (status === 'uncollectible') {
          icon = 'close-circle';
          iconColor = 'grey';
        }

        if (status === 'void') {
          icon = 'stop';
          iconColor = 'grey';
        }

        return (
          <>
            <Icon type={icon} theme="twoTone" twoToneColor={iconColor} />
            <span style={{ marginLeft: 8, color: iconColor }}>{status.toUpperCase()}</span>
          </>
        );
      },
    },
    {
      title: 'Amount',
      render(test, data) {
        const { total } = data;
        return `$${total / 100}`;
      },
    },
    {
      title: 'Invoice Date',
      render(test, data) {
        const { created: invoiceDate } = data;
        const dateObj = new Date(invoiceDate * 1000);
        const displayTime = readableTime(dateObj);
        return displayTime;
      },
    },
    {
      title: 'Download',
      render(test, data) {
        const { hosted_invoice_url: invoiceUrl } = data;
        return <a onClick={() => window.open(invoiceUrl, '_blank')}>View Invoice</a>;
      },
    },
  ];

  useEffect(() => {
    const getInvoiceData = async () => {
      const invoices = await getInvoices();
      setInvoices(invoices);
    };
    getInvoiceData();
  }, [reload]);
  return (
    <div style={{ paddingTop: 12 }}>
      <Stripey />
      <Spin spinning={!invoices}>
        <Table size="small" dataSource={invoices} pagination={false} columns={columnsTeam} />
      </Spin>
    </div>
  );
};

const Stripey = () => (
  <Elements>
    <CurrentPaymentMethod />
  </Elements>
);
export default Billing;
