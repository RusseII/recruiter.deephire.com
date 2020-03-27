import React, { PureComponent } from 'react';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import styles from './index.less';

export default class EditableItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      editable: false,
    };
  }

  handleChange = e => {
    const { value } = e.target;
    this.setState({ value });
  };

  check = () => {
    this.setState({ editable: false });
    const { value } = this.state;
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  edit = () => {
    this.setState({ editable: true });
  };

  render() {
    const { value, editable } = this.state;
    return (
      <div className={styles.editableItem}>
        {editable ? (
          <div className={styles.wrapper}>
            <Input value={value} onChange={this.handleChange} onPressEnter={this.check} />
            <CheckOutlined className={styles.icon} onClick={this.check} />
          </div>
        ) : (
          <div className={styles.wrapper}>
            <span>{value || ' '}</span>
            <EditOutlined className={styles.icon} onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
