import React, { useState } from 'react';

import moment from 'moment';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const Range = ({ value = {}, onChange }) => {
  const [dates, setDates] = useState([null, null]);
  function disabledDate(current) {
    const tooEarly = current && current < moment().startOf('day');
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 1;

    return tooEarly || tooLate;
  }

  const triggerChange = changedValue => {
    if (onChange) {
      onChange({ interviewTime: dates, ...value, ...changedValue });
    }
  };

  const setSecondValue = times => {
    if (!times) {
      setDates([null, null]);
      triggerChange({ interviewTime: null });
      return;
    }

    // eslint-disable-next-line prefer-const
    let [startTime, endTime] = times;

    if (!endTime) {
      endTime = moment(startTime);
      endTime.add(30, 'minutes');
    }
    setDates([startTime, endTime]);
    triggerChange({ interviewTime: [startTime, endTime] });
  };
  return (
    <RangePicker
      style={{ width: '100%' }}
      disabledDate={disabledDate}
      showTime={{
        minuteStep: 15,
        hideDisabledOptions: true,
        use12Hours: true,
        format: 'h:mm a',
      }}
      value={dates}
      format="MM-DD h:mm a"
      onCalendarChange={setSecondValue}
    />
  );
};

export default Range;
