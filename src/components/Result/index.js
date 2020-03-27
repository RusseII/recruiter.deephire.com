import React from 'react';
import classNames from 'classnames';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import styles from './index.less';

export default function Result({
  className,
  type,
  title,
  description,
  extra,
  actions,
  extraStyle,
  ...restProps
}) {
  const iconMap = {
    error: <CloseCircleFilled className={styles.error} />,
    success: <CheckCircleFilled className={styles.success} />,
  };
  const clsString = classNames(styles.result, className);
  return (
    <div className={clsString} {...restProps}>
      <div className={styles.icon}>{iconMap[type]}</div>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
      {extra && (
        <div style={extraStyle} className={styles.extra}>
          {extra}
        </div>
      )}
      {/* {description && <div className={`${customStyles != null ? customStyles : ''} ${styles.description}`}>{description}</div>} */}

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
