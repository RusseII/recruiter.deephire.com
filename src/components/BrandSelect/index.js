import React from 'react';
import { Form, Select } from 'antd';
import { useCompany } from '@/services/apiHooks';

const { Option } = Select;

export function RawBrandSelect({ style }) {
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
    <Select style={style} placeholder="Select a brand." showSearch>
      {Options()}
    </Select>
  );
}

function BrandSelect({ layout, style }) {
  const SelectBox = RawBrandSelect({ style });

  if (!SelectBox) {
    return null;
  }

  return (
    <Form.Item {...layout} name="recruiterCompany" label="Brand">
      {SelectBox}
    </Form.Item>
  );
}

export default BrandSelect;
