import { useEffect, useState } from 'react';
import { getCompany } from './api';

const useCompanyInfo = () => {
  const [companyData, setCompanyData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCompany();
      setCompanyData(data);
    };
    fetchData();
  }, []);
  return companyData;
};

export default useCompanyInfo;
