import React from 'react';

import { Empty, Button } from 'antd';
import router from 'umi/router';

const customEmpty = (description, route, buttonText, customButton = null) => {
  const click = () => {
    router.push(route);
  };
  return (
    <Empty description={<span>{description}</span>}>
      {buttonText && (
        <Button onClick={click} type="primary">
          {buttonText}
        </Button>
      )}
      {customButton && customButton}
    </Empty>
  );
};

export default customEmpty;
