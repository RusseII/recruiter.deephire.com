import { useEffect, useState } from 'react';
import { getCompany } from './api';

const useCompanyInfo = update => {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCompany();
      setCompanyData(data);
    };
    fetchData();
  }, [update]);
  return companyData;
};

export default useCompanyInfo;
