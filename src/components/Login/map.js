import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default {
  Email: {
    props: {
      size: 'large',
      type: 'email',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
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
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
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
      prefix: <Icon type="user" className={styles.prefixIcon} />,
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
      prefix: <Icon type="bank" className={styles.prefixIcon} />,
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
