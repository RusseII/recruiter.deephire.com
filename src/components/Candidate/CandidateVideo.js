import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  NotificationOutlined,
  SoundOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';

import { Card, Spin, Slider, Space } from 'antd';
import { formatTime } from '@/utils/utils';

import styles from './index.less';

const msFor60Fps = 16.6;
// const msFor60Fps = 2000;

// const marks = { 66: '', 120: '' };

const CandidateVideo = ({
  currentQuestionText,
  videoUrl,
  duration,
  setDuration,
  progress,
  setProgress,
  videoRef,
  controlKeys,
  playing,
  setPlaying,
  marks,
  interval,
}) => {
  const [muted, setMuted] = useState(false);
  const [hover, setHover] = useState(true);

  // const comments = [{ id: 123, comment: 'Why do you like this position?', time: 5 }];

  const handleEnter = event => {
    const { code } = event;
    if (code === 'Space' && controlKeys) {
      event.preventDefault();
      setPlaying(playing => !playing);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [controlKeys]);

  return (
    <Spin spinning={!videoUrl}>
      <Card title={currentQuestionText}>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(true)}
          className={styles.playerWrapper}
        >
          <ReactPlayer
            className={styles.reactPlayer}
            ref={videoRef}
            height="100%"
            width="100%"
            playing={playing}
            muted={muted}
            progressInterval={msFor60Fps}
            config={{ youtube: { playerVars: { rel: false, modestbranding: true } } }}
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
              style={{
                marginLeft: 8,
                marginRight: 8,
                marginBottom: 0,
                paddingTop: 4,
                paddingBottom: 4,
              }}
              max={duration * interval}
              marks={marks}
              value={progress.playedSeconds * interval}
              onChange={playedSeconds => {
                if (playing) {
                  setPlaying(false);
                }
                videoRef.current.seekTo(playedSeconds / interval, 'seconds');
                setProgress(progress => ({
                  ...progress,
                  playedSeconds: playedSeconds / interval,
                }));
              }}
              onAfterChange={() => {
                // setTimeout makes sure that this is called after onChange
                setTimeout(() => setPlaying(true), 200);
              }}
              tipFormatter={tip => formatTime(tip / interval)}
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
