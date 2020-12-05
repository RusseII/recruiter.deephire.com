import React, { useState } from 'react';

import moment from 'moment';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const calendarProps = {
  showTime: {
    minuteStep: 15,
    hideDisabledOptions: true,
    use12Hours: true,
    format: 'h:mm a',
  },
  format: 'MM-DD h:mm a',
};

const Range = ({ onChange, interviewTime, disabled }) => {
  const [dates, setDates] = useState(
    interviewTime ? [moment(interviewTime[0]), moment(interviewTime[1])] : [null, null]
  );
  function disabledDate(current) {
    const tooEarly = current && current < moment().startOf('day');
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 1;

    return tooEarly || tooLate;
  }

  const triggerChange = changedValue => {
    if (onChange) {
      onChange(changedValue);
    }
  };

  const setSecondValue = times => {
    if (!times) {
      setDates([null, null]);
      triggerChange(null);
      return;
    }

    // eslint-disable-next-line prefer-const
    let [startTime, endTime] = times;

    if (!endTime) {
      endTime = moment(startTime);
      endTime.add(30, 'minutes');
    }
    setDates([startTime, endTime]);
    triggerChange([startTime, endTime]);
  };
  return (
    <RangePicker
      disabled={disabled}
      style={{ width: '100%' }}
      disabledDate={disabledDate}
      value={dates}
      onCalendarChange={setSecondValue}
      {...calendarProps}
    />
  );
};

// why doesnt this work in a form??
// export const SingleDate = () => {
//   function disabledDate(current) {
//     const tooEarly = current && current < moment().startOf('day');

//     return tooEarly;
//   }
//   return <DatePicker disabledDate={disabledDate} {...calendarProps} />;
// };

export default Range;
