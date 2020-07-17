import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  NotificationOutlined,
  SoundOutlined,
  PauseOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';

import { Spin, Slider, Space, Select, Row } from 'antd';
import { formatTime } from '@bit/russeii.deephire.utils.utils';

const proxyUrl = videoUrl => {
  const uuid = `v-${/((\w{4,12}-?)){5}/.exec(videoUrl)[0]}`;
  const url = `https://a.deephire.com/v1/videos/proxy/${uuid}`;
  return url;
};

const { Option } = Select;
const msFor60Fps = 16.6;
// const msFor60Fps = 2000;

// const marks = { 66: '', 120: '' };

const styles = {
  playerWrapper: {
    position: 'relative',
    paddingTop: '75%',
    // boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
  },

  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  icon: {
    color: '#f1f7fe',
    // fontSize: 16,
  },
};

const CandidateVideo = ({
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
  const [ready, setReady] = useState(false);

  const [hover, setHover] = useState(true);
  const [error, setError] = useState(false);
  const storedSpeed = localStorage.getItem('deepHirePlaybackSpeed');

  const [playbackSpeed, setPlaybackSpeed] = useState(storedSpeed || '1');

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

  useEffect(() => {
    setReady(false);
  }, [videoUrl]);

  return (
    <Spin spinning={!ready}>
      {/* <Card title={currentQuestionText}> */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(true)}
        style={styles.playerWrapper}
      >
        <ReactPlayer
          onReady={() => setReady(true)}
          onError={() => setError(true)}
          style={styles.reactPlayer}
          ref={videoRef}
          height="100%"
          width="100%"
          playing={playing}
          playbackRate={playbackSpeed}
          muted={muted}
          progressInterval={msFor60Fps}
          config={{ youtube: { playerVars: { rel: false, modestbranding: true } } }}
          onDuration={duration => setDuration(duration)}
          onProgress={progress => setProgress(progress)}
          url={error ? proxyUrl(videoUrl) : videoUrl}
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

          <Row justify="space-between" style={{ marginLeft: 16, marginRight: 16, marginBottom: 8 }}>
            <Space size="middle">
              {playing ? (
                <PauseOutlined
                  style={styles.icon}
                  onClick={() => setPlaying(playing => !playing)}
                />
              ) : (
                <CaretRightOutlined
                  style={styles.icon}
                  onClick={() => setPlaying(playing => !playing)}
                />
              )}
              {muted ? (
                <NotificationOutlined
                  style={styles.icon}
                  onClick={() => setMuted(muted => !muted)}
                />
              ) : (
                <SoundOutlined style={styles.icon} onClick={() => setMuted(muted => !muted)} />
              )}
              <div style={{ fontSize: 12, color: 'white' }}>
                {`${formatTime(progress.playedSeconds)} / ${formatTime(duration)}`}
              </div>

              {/* <a download href={videoUrl}>
              Download
            </a> */}
            </Space>
            <SpeedSelector playbackSpeed={playbackSpeed} setPlaybackSpeed={setPlaybackSpeed} />
          </Row>
        </div>
      </div>
      {/* <Button style={{ marginTop: 24 }}>Create Clips</Button> */}
      {/* </Card> */}
    </Spin>
  );
};

const SpeedSelector = ({ playbackSpeed, setPlaybackSpeed }) => {
  // const playbackSpeed = localStorage.getItem('deepHirePlaybackSpeed');
  // localStorage.setItem('mytime', '2');
  const updatePlaybackSpeed = speed => {
    setPlaybackSpeed(speed);
    localStorage.setItem('deepHirePlaybackSpeed', speed);
  };

  return (
    <Select
      showArrow={false}
      style={styles.icon}
      // dropdownStyle={{ width: 100 }}
      dropdownMatchSelectWidth={false}
      size="small"
      bordered={false}
      value={playbackSpeed}
      onChange={speed => updatePlaybackSpeed(speed)}
    >
      <Option value="1">1x</Option>
      <Option value="1.25">1.25x</Option>
      <Option value="1.5">1.5x</Option>
      <Option value="2">2x</Option>
    </Select>
  );
};

export default CandidateVideo;
