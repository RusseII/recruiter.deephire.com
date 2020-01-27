/* global $crisp */
import {
  message,
  Row,
  Col,
  Card,
  Tooltip,
  ConfigProvider,
  Statistic,
  Alert,
  Button,
  Drawer,
} from 'antd';
import React, { Fragment, useEffect, useState, useContext } from 'react';
import readableTime from 'readable-timestamp';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import { getInterviews, getArchivedInterviews, updateInterviews } from '@/services/api';
import ArchiveButton from '@/components/ArchiveButton';
import customEmpty from '@/components/CustomEmpty';

import CloneButton from '@/components/CloneButton';

import Step1 from '@/pages/Interviews/CreateInterviewForm/Step1';
import { getHttpUrl } from '@/utils/utils';
import GlobalContext from '@/layouts/MenuContext';
import InviteCandidates from '@/components/InviteCandidates';

const TableList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archives, setArchives] = useState(false);
  const [editInterview, setEditInterview] = useState(null);
  const [inviteCandidates, setInviteCandidates] = useState(null);
  const [reload, setReload] = useState(false);
  const [unArchivedInterviewCount, setUnArchivedInterviewCount] = useState(' ');

  const globalData = useContext(GlobalContext);
  const { interviews, setInterviews, stripeProduct } = globalData;
  const { allowedInterviews } = stripeProduct.metadata || {};
  const updateInterview = async cleanedValueData => {
    await updateInterviews(editInterview._id, cleanedValueData);
    setEditInterview(null);
    message.success('Interview Updated');
  };
  const columns = [
    {
      title: 'Interview Name',
      dataIndex: 'interviewName',
    },

    {
      title: 'Interview Questions',
      render(x, data) {
        try {
          const listItems = data.interviewQuestions.map(d => (
            <div>
              <li key={d.question}>{d.question}</li>
              <br />
            </div>
          ));
          return <div>{listItems} </div>;
        } catch {
          return null;
        }
      },
    },
    {
      title: 'Created By',
      render(test, data) {
        const { createdBy } = data;
        try {
          const dateObj = new Date(data.timestamp);
          const displayTime = readableTime(dateObj);
          return (
            <>
              <div>{createdBy}</div>
              <div>{displayTime}</div>
            </>
          );
        } catch {
          return createdBy;
        }
      },
    },

    // {
    //   title: email === 'demo@deephire.com' ? 'Invite' : null,
    //   render: () =>
    //     email === 'demo@deephire.com' ? (
    //       <a onClick={() => setInviteCandidates(true)}>Invite</a>
    //     ) : null,
    // },

    // {
    //   title: 'Edit',
    //   render: (text, data) => <a onClick={() => setEditInterview(data)}>Edit</a>,
    // },
    // {
    //   title: 'Interview Link',
    //   fixed: 'right',
    //   render: (text, data) => (
    //     <Fragment>
    //       <Tooltip title="Click to copy">
    //         <CopyToClipboard
    //           text={getHttpUrl(data.shortUrl)}
    //           onCopy={() => message.success('Link Copied')}
    //         >
    //           <a>{data.shortUrl || '-'}</a>
    //         </CopyToClipboard>
    //       </Tooltip>
    //     </Fragment>
    //   ),
    // },

    {
      title: '',
      fixed: 'right',
      render: (text, data) => (
        <Fragment>
          <Tooltip title="Invite candidates">
            <Button
              onClick={() => setInviteCandidates(true)}
              style={{ marginLeft: 8 }}
              shape="circle"
              icon="user-add"
            />
          </Tooltip>
          <Tooltip title="Edit interview">
            <Button
              onClick={() => setEditInterview(data)}
              style={{ marginLeft: 8 }}
              shape="circle"
              icon="edit"
            />
          </Tooltip>
          <Tooltip title="View interview share link">
            <Button style={{ marginLeft: 8 }} shape="circle" icon="link" />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  const getData = async () => {
    setLoading(true);
    let data;
    if (archives) {
      data = await getArchivedInterviews();
      const interviewDataForLength = await getInterviews();
      setUnArchivedInterviewCount(interviewDataForLength.length || 0);
    } else {
      data = await getInterviews();
      setUnArchivedInterviewCount(data.length || 0);
    }
    setInterviews(data || []);
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, [archives, reload]);

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <PageHeaderWrapper title="Interviews">
      <InviteCandidates
        setInviteCandidates={setInviteCandidates}
        inviteCandidates={inviteCandidates}
      />

      <Drawer
        destroyOnClose
        title="Edit Interview"
        visible={Boolean(editInterview)}
        onClose={() => setEditInterview(false)}
        width={window.innerWidth > 720 ? 378 : null}
        drawerStyle={{ backgroundColor: '#f0f2f5' }}
      >
        <Step1 setReload={setReload} onClick={updateInterview} data={editInterview} />
      </Drawer>

      {unArchivedInterviewCount > allowedInterviews && (
        <Alert
          style={{ marginBottom: 20 }}
          message="Interview Cap Exceeded"
          description={
            <div>
              You have more interviews than allowed on your plan. Some of your interviews may be
              removed. Please archive unused interviews, or{' '}
              <a
                onClick={() => {
                  $crisp.push([
                    'do',
                    'message:send',
                    ['text', "Hi, I'm interested in upgrading my plan!"],
                  ]);
                  $crisp.push(['do', 'chat:open']);
                }}
              >
                message our support to upgrade.
              </a>
            </div>
          }
          type="error"
          showIcon
        />
      )}
      <Card>
        <Row align="middle" type="flex" justify="space-between">
          <Col>
            <Row align="middle" type="flex">
              <AllowedInterviews
                allowedInterviews={allowedInterviews}
                totalInterviews={unArchivedInterviewCount}
              />
              {selectedRows.length !== 0 && (
                <>
                  <ArchiveButton
                    onClick={() => setSelectedRows([])}
                    reload={getData}
                    archives={archives}
                    route="interviews"
                    archiveData={selectedRows}
                  />
                  <CloneButton
                    onClick={() => setSelectedRows([])}
                    reload={getData}
                    cloneData={selectedRows}
                  />
                </>
              )}
            </Row>
          </Col>
          <Col>
            <a onClick={() => setArchives(!archives)}>{archives ? 'View All' : 'View Archived'} </a>
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        <ConfigProvider
          renderEmpty={() =>
            customEmpty('No Interviews', '/interview/create-interview/info', 'Create Interview Now')
          }
        >
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={{ list: interviews }}
            // size="small"
            columns={columns}
            onSelectRow={rows => setSelectedRows(rows)}
          />
        </ConfigProvider>
      </Card>
    </PageHeaderWrapper>
  );
};

const AllowedInterviews = ({ totalInterviews, allowedInterviews }) => (
  <Tooltip title="Total interviews used">
    <div>
      <Statistic
        style={{ marginRight: 16 }}
        valueStyle={totalInterviews > allowedInterviews ? { color: 'red' } : null}
        value={totalInterviews}
        suffix={`/ ${allowedInterviews}`}
      />
    </div>
  </Tooltip>
);

export default TableList;
