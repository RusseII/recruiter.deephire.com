import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  NotificationOutlined,
  SoundOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import moment from 'moment';

import { Card, Spin, Slider, Space } from 'antd';

import styles from './index.less';

// const marks = { 66: '', 120: '' };
const formatTime = time => {
  const currentTime = moment()
    .startOf('day')
    .seconds(time)
    .format('HH:mm:ss');
  if (currentTime[0] === '0' && currentTime[1] === '0') return currentTime.slice(3);
  return currentTime;
};

const CandidateVideo = ({ currentQuestionText, videoUrl }) => {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [hover, setHover] = useState(false);

  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({ playedSeconds: 0 });
  const refContainer = useRef(null);

  const handleEnter = event => {
    const { code } = event;
    if (code === 'Space') {
      event.preventDefault();
      setPlaying(playing => !playing);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, []);
  return (
    <Spin spinning={!videoUrl}>
      <Card title={currentQuestionText}>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={styles.playerWrapper}
        >
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
              display: hover || !playing ? 'block' : 'none',
              backgroundColor: 'rgba(0,0,0,.7)',
            }}
          >
            <Slider
              style={{ marginLeft: 8, marginRight: 8, marginBottom: 0 }}
              max={duration}
              // dots
              // marks={marks}
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
              <div style={{ fontSize: 12, color: 'white' }}>
                {`${formatTime(progress.playedSeconds)} / ${formatTime(duration)}`}
              </div>
            </Space>
          </div>
        </div>
        {/* <Button style={{ marginTop: 24 }}>Create Clips</Button> */}
      </Card>
    </Spin>
  );
};

export default CandidateVideo;
