import React from 'react';

import { Empty, Button } from 'antd';
import router from 'umi/router';

const customEmpty = (description, route, buttonText) => {
  return (
    <Empty description={<span>{description}</span>}>
      {buttonText && (
        <Button
          onClick={() => {
            router.push(route);
          }}
          type="primary"
        >
          {buttonText}
        </Button>
      )}
    </Empty>
  );
};

export default customEmpty;
