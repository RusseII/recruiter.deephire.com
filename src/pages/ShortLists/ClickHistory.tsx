import React from 'react';
import { Timeline, Card, Skeleton } from 'antd';
import readableTime from 'readable-timestamp';

interface Click {
  clickTime: string;
  color: string;
  message: string;
}

interface ClickHistoryProps {
  clicks: Click[];
  pending: boolean;
}

const friendlyDate = rawDate => {
  const dateObj = new Date(rawDate);
  const displayTime = readableTime(dateObj);
  return displayTime;
};
const ClickHistory = ({ clicks, pending }: ClickHistoryProps) => {
  let sortedClicks = [];
  if (clicks) {
    sortedClicks = clicks.sort((a, b) => +new Date(b.clickTime) - +new Date(a.clickTime));
  }
  return (
    <Card title="Link Click History">
      <Skeleton
        loading={pending}
        title={false}
        paragraph={{ rows: 3, width: [200, 250, 250] }}
        active
      >
        {clicks && (
          <Timeline style={{ marginBottom: -48 }}>
            {sortedClicks.map(click => (
              <Timeline.Item color={click.color}>
                {`${click.message} ${friendlyDate(click.clickTime)}`}
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Skeleton>
    </Card>
  );
};

export default ClickHistory;
