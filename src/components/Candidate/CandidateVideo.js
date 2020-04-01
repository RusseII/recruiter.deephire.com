import React from 'react';
import ReactPlayer from 'react-player';

import { Card, Spin } from 'antd';

import styles from './index.less';

const CandidateVideo = ({ currentQuestionText, videoUrl }) => (
  <Spin spinning={!videoUrl}>
    <Card title={currentQuestionText}>
      <div className={styles.playerWrapper}>
        <ReactPlayer
          youtubeConfig={{ playerVars: { rel: false, modestbranding: true } }}
          preload
          controls
          playing
          className={styles.reactPlayer}
          height="100%"
          width="100%"
          url={videoUrl}
        />
      </div>
    </Card>
  </Spin>
);

export default CandidateVideo;
