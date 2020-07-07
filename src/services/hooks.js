import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { getCompany } from './api';

// Hook
export const useAsync = (asyncFunction, immediate = true) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures t\he below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(
    (...params) => {
      setPending(true);
      setValue(null);
      setError(null);
      return (
        asyncFunction(...params)
          .then(response => setValue(response))
          // eslint-disable-next-line no-shadow
          .catch(error => setError(error))
          .finally(() => setPending(false))
      );
    },
    [asyncFunction]
  );

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, pending, value, error };
};

export const useCompanyInfo = update => {
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

export const useSearch = () => {
  const searchInput = useRef();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, columnName, arrayIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${columnName}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
      if (Array.isArray(record[dataIndex])) {
        let flag = false;
        record[dataIndex].forEach(item => {
          if (
            item[arrayIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          ) {
            flag = true;
          }
        });
        return flag;
      }
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select());
      }
    },
    render: text => {
      if (searchedColumn === dataIndex) {
        if (Array.isArray(text)) {
          return (
            <div>
              {text.map(item => (
                <div>
                  <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={item[arrayIndex].toString()}
                  />
                  <br />
                  <br />
                </div>
              ))}
            </div>
          );
        }

        return (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        );
      }
      if (Array.isArray(text)) {
        return text.map(d => (
          <div>
            <li key={d.question}>{d.question}</li>
            <br />
          </div>
        ));
      }
      return text;
    },
  });

  return getColumnSearchProps;
};

export const useVideo = () => {
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({ playedSeconds: 0 });
  const videoRef = useRef(null);

  return { duration, setDuration, progress, setProgress, videoRef };
};
