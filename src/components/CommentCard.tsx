import React, { useEffect, useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { getCandidateProfile, updateCandidateProfile } from '@/services/api';

const CommentCard = ({ setControlKeys, email }) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleCommentChange = e => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    // Do something with the submitted comment, e.g., send it to a server
    setIsButtonLoading(true);
    await updateCandidateProfile(email, { comment });
    setIsButtonLoading(false);
    message.success('Comment submitted');
  };

  useEffect(() => {
    const getInfo = async () => {
      setIsLoading(true);
      const data = await getCandidateProfile(email);
      setIsLoading(false);
      if (data && data.comment) {
        setComment(data.comment);
      }
    };
    if (email) getInfo();
  }, [email]);
  return (
    <Card loading={isLoading} title="Comments">
      <Input.TextArea
        onFocus={() => setControlKeys(false)}
        onBlur={() => setControlKeys(true)}
        style={{ marginBottom: 24 }}
        placeholder="Enter your comment"
        value={comment}
        onChange={handleCommentChange}
      />
      <Button loading={isButtonLoading} type="primary" onClick={handleCommentSubmit}>
        Submit
      </Button>
    </Card>
  );
};

export default CommentCard;
