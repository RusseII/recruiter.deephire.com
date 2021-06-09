import React from 'react';
import { Form, Select } from 'antd';
import { useCompany } from '@/services/apiHooks';

const { Option } = Select;

function BrandSelect() {
  const { data: companyData } = useCompany();

  if (!companyData?.brands) {
    return null;
  }

  const Options = () => {
    const { brands } = companyData;

    const brandOptions = Object.keys(brands).map(brand => {
      const brandData = brands[brand];
      return <Option value={brand}>{brandData.name}</Option>;
    });

    return brandOptions;
  };

  return (
    <Form.Item name="recruiterCompany" label="Brand">
      <Select placeholder="Select a brand." showSearch>
        {Options()}
      </Select>
    </Form.Item>
  );
}

export default BrandSelect;
