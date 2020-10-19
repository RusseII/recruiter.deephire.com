import { ShareAltOutlined } from "@ant-design/icons";
import { Tooltip, Popover, Radio, Typography, Space } from "antd";
import React, { useState } from "react";

const ShareInterview = ({ url }) => {
    const [visibility, setVisibility] = useState({ hovered: false, clicked: false });
    return (
      <Tooltip
        title="Share interview link"
        trigger="hover"
        visible={visibility.hovered}
        onVisibleChange={visible => setVisibility({ hovered: visible, clicked: false })}
      >
        <Popover
          title="Share link to the Interview"
          placement='left'
          content={<ShareInterviewContent url={url}/>}
          trigger="click"
          visible={visibility.clicked}
          onVisibleChange={visible => setVisibility({ hovered: false, clicked: visible })}
        >
          <ShareAltOutlined />
        </Popover>
      </Tooltip>
    );
  };


  export const ShareInterviewContent = ({url}) => {
    const [role, setRole] = useState<'candidate' | 'recruiter' | 'client' | null>(null)
  

    return (
      <Space size='middle' style={{width: '100%'}} direction="vertical">
     <div>This link is unique for the role of the person you would like to share with.</div>
     <span>Do not share it with anyone except for the selected role.</span>
     <Space>Share with a
      <Radio.Group onChange={(e) => setRole(e.target.value)}>
      <Radio.Button value="candidate">Candidate</Radio.Button>
      <Radio.Button value="recruiter">Recruiter</Radio.Button>
      <Radio.Button value="client">Client</Radio.Button>
    </Radio.Group>
    </Space>
    <div>
    {role && <Typography.Text keyboard copyable>{`${url}?role=${role}`}</Typography.Text>}
    </div>
      </Space>
    )
  }

  export default ShareInterview