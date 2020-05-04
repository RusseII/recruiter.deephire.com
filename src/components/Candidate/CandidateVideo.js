import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import {
  NotificationOutlined,
  SoundOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import moment from 'moment';

import { Card, Spin, Slider, Space, Button } from 'antd';

import styles from './index.less';

const formatTime = time => {
  return moment()
    .startOf('day')
    .seconds(time)
    .format('H:mm:ss');
};

const CandidateVideo = ({ currentQuestionText, videoUrl }) => {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [hover, setHover] = useState(false);

  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({ playedSeconds: 0 });
  const refContainer = useRef(null);
  return (
    <Spin spinning={!videoUrl}>
      <Card title={currentQuestionText}>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={styles.playerWrapper}
        >
          {/* <ReactPlayer
          youtubeConfig={{ playerVars: { rel: false, modestbranding: true } }}
          preload
          controls
          playing
          className={styles.reactPlayer}
          height="100%"
          width="100%"
          url={videoUrl}
        /> */}
          <ReactPlayer
            className={styles.reactPlayer}
            ref={refContainer}
            height="100%"
            width="100%"
            playing={playing}
            muted={muted}
            youtubeConfig={{ playerVars: { rel: false, modestbranding: true } }}
            preload
            onDuration={duration => setDuration(duration)}
            onProgress={progress => setProgress(progress)}
            url={videoUrl}
          />
          <div
            onClick={() => setPlaying(playing => !playing)}
            style={{
              position: 'absolute',
              top: 0,
              height: 'calc(100% - 50px)',
              width: '100%',
            }}
          />
          <div
            style={{
              width: '100%',
              bottom: 0,
              position: 'absolute',
              display: hover ? 'block' : 'none',
              backgroundColor: 'rgba(0,0,0,.7)',
            }}
          >
            <Slider
              style={{ marginBottom: 0 }}
              max={duration}
              // dots={true}
              value={progress.playedSeconds}
              onChange={playedSeconds => {
                setPlaying(false);
                setProgress(progress => ({
                  ...progress,
                  playedSeconds,
                }));
              }}
              onAfterChange={playedSeconds => {
                refContainer.current.seekTo(playedSeconds);
                setPlaying(true);
              }}
              // step={1}
              tipFormatter={tip => formatTime(tip)}
            />
            <Space style={{ marginLeft: 16, marginBottom: 8 }} size="middle">
              {playing ? (
                <PauseOutlined
                  className={styles.icon}
                  onClick={() => setPlaying(playing => !playing)}
                />
              ) : (
                <CaretRightOutlined
                  className={styles.icon}
                  onClick={() => setPlaying(playing => !playing)}
                />
              )}
              {muted ? (
                <NotificationOutlined
                  className={styles.icon}
                  onClick={() => setMuted(muted => !muted)}
                />
              ) : (
                <SoundOutlined className={styles.icon} onClick={() => setMuted(muted => !muted)} />
              )}
              <div style={{ color: 'white' }}>
                {`${formatTime(progress.playedSeconds)}/${formatTime(duration)}`}
              </div>
            </Space>
          </div>
        </div>
        <Button style={{ marginTop: 24 }}>Create Clips</Button>
      </Card>
    </Spin>
  );
};

export default CandidateVideo;
