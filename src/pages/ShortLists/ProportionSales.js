import React, { memo } from 'react';
import { Card, Radio } from 'antd';
import styles from './ShortListAnalytics.less';
import { Pie } from '@/components/Charts';
import Yuan from '@/utils/Yuan';

const ProportionSales = memo(
  ({ candidateStatus, loading, salesPieData, handleChangeSalesType, title }) => (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title={title}
      bodyStyle={{ padding: 24 }}
      extra={
        <div className={styles.salesCardExtra}>
          <div className={styles.salesTypeRadio}>
            <Radio.Group value={candidateStatus} onChange={handleChangeSalesType}>
              <Radio.Button value="overview">Overview</Radio.Button>
              <Radio.Button value="reviewed">Reviewed</Radio.Button>
              <Radio.Button value="notReviewed">Not Reviewed</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      }
      // style={{ marginTop: 24 }}
    >
      <Pie
        colors={['#08c', 'gray', 'red']}
        hasLegend
        subTitle="Candidates"
        total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
        data={salesPieData}
        valueFormat={value => <Yuan>{value}</Yuan>}
        height={270}
        lineWidth={4}
        style={{ padding: '8px 0' }}
      />
    </Card>
  )
);

export default ProportionSales;
