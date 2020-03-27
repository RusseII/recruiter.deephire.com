import React from 'react';
import { BankOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.less';

export default {
  Email: {
    props: {
      size: 'large',
      type: 'email',
      prefix: <MailOutlined className={styles.prefixIcon} />,
    },
    rules: [
      {
        required: true,
        message: 'Please enter email!',
      },
      { type: 'email', message: 'The input is not valid E-mail!' },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LockOutlined className={styles.prefixIcon} />,
      type: 'password',
    },
    rules: [
      {
        required: true,
        message: 'Please enter password!',
      },
    ],
  },

  Name: {
    props: {
      size: 'large',
      prefix: <UserOutlined className={styles.prefixIcon} />,
      // type: 'password',
    },
    rules: [
      {
        required: true,
        message: 'Please enter your full name!',
      },
    ],
  },

  Company: {
    props: {
      size: 'large',
      prefix: <BankOutlined className={styles.prefixIcon} />,
      // type: 'password',
    },
    rules: [
      {
        required: true,
        message: 'Please enter your company name!',
      },
    ],
  },
};
