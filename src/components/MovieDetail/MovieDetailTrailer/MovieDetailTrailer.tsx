import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, TVFocusGuideView, Image, BackHandler, findNodeHandle } from 'react-native';
import { styles } from './MovieDetailTrailer.styles';
import { WebView } from 'react-native-webview';

export const MovieDetailTrailer = ({ trailerUrl, onPlay, onExitVideo, nextFocusUpNode, onFocusContent }: { trailerUrl: string, onPlay?: () => void, onExitVideo?: () => void, nextFocusUpNode?: number | null, onFocusContent?: () => void }) => {
  if (!trailerUrl) {
    return <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Chưa có Trailer.</Text>;
  }

  let videoId = '';
  const match = trailerUrl.match(/[?&]v=([^&]+)/) || trailerUrl.match(/youtu\.be\/([^?]+)/) || trailerUrl.match(/embed\/([^?]+)/);
  if (match && match[1]) {
    videoId = match[1];
  }

  if (!videoId) {
    return <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Link Trailer không hợp lệ.</Text>;
  }

  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  const webViewRef = useRef<WebView>(null);
  const rewindRef = useRef<any>(null);
  const playPauseRef = useRef<any>(null);
  const forwardRef = useRef<any>(null);
  const [rewindNode, setRewindNode] = useState<number | null>(null);
  const [playPauseNode, setPlayPauseNode] = useState<number | null>(null);
  const [forwardNode, setForwardNode] = useState<number | null>(null);

  const [isVideoMode, setIsVideoMode] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [focusedBtn, setFocusedBtn] = useState<string | null>(null);

  useEffect(() => {
    if (isVideoMode) {
      setTimeout(() => {
        if (rewindRef.current) setRewindNode(findNodeHandle(rewindRef.current));
        if (playPauseRef.current) setPlayPauseNode(findNodeHandle(playPauseRef.current));
        if (forwardRef.current) setForwardNode(findNodeHandle(forwardRef.current));
      }, 100);
    }
  }, [isVideoMode]);

  useEffect(() => {
    if (isVideoMode) {
      const backAction = () => {
        setIsVideoMode(false);
        setPlaying(false);
        if (onExitVideo) onExitVideo();
        return true; 
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, [isVideoMode]);

  const handleSeek = (seconds: number) => {
    webViewRef.current?.injectJavaScript(`
      if (window.player && typeof window.player.seekTo === 'function') {
        var current = window.player.getCurrentTime() || 0;
        window.player.seekTo(current + ${seconds}, true);
      }
      true;
    `);
  };

  const togglePlay = () => {
    if (playing) {
      webViewRef.current?.injectJavaScript(`if(window.player) { window.player.pauseVideo(); }; true;`);
      setPlaying(false);
    } else {
      webViewRef.current?.injectJavaScript(`if(window.player) { window.player.playVideo(); }; true;`);
      setPlaying(true);
    }
  };

  const renderNetflixButton = (id: string, iconUrl: string, label: string, onPress: () => void, btnRef: any, nextLeft?: number | null, nextRight?: number | null) => {
    const isFocused = focusedBtn === id;
    return (
      <TouchableHighlight
        ref={btnRef}
        nextFocusLeft={nextLeft}
        nextFocusRight={nextRight}
        onFocus={() => {
          setFocusedBtn(id);
          if (onFocusContent) onFocusContent();
        }}
        onBlur={() => setFocusedBtn(null)}
        onPress={onPress}
        style={[styles.netflixBtn, isFocused && styles.netflixBtnFocused]}
        underlayColor="#fff"
        hasTVPreferredFocus={id === 'play_pause'}
        nextFocusUp={nextFocusUpNode}
      >
        <View style={styles.netflixBtnInner}>
          <Image 
            source={{ uri: iconUrl }} 
            style={{ width: 24, height: 24, tintColor: isFocused ? '#141414' : '#ffffff' }} 
          />
          <Text style={[styles.netflixBtnLabel, isFocused && styles.netflixTextFocused]}>{label}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  const youtubeHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body, html { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #000; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
      </style>
    </head>
    <body>
      <div id="player"></div>
      <script>
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        function onYouTubeIframeAPIReady() {
          player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: '${videoId}',
            playerVars: {
              'autoplay': 1,
              'controls': 0,
              'modestbranding': 1,
              'rel': 0,
              'showinfo': 0,
              'fs': 0,
              'disablekb': 1,
              'playsinline': 1,
              'origin': 'https://lonelycpp.github.io'
            },
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange,
              'onError': onPlayerError
            }
          });
        }

        function onPlayerReady(event) {
          event.target.playVideo();
          window.ReactNativeWebView.postMessage("READY");
        }

        function onPlayerStateChange(event) {
          window.ReactNativeWebView.postMessage("STATE_" + event.data);
        }

        function onPlayerError(event) {
           window.ReactNativeWebView.postMessage("ERROR_" + event.data);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {!isVideoMode ? (
        <TVFocusGuideView autoFocus style={{ width: '100%', alignItems: 'center' }}>
          <TouchableHighlight
            nextFocusUp={nextFocusUpNode}
            onFocus={() => {
              setFocusedBtn('thumb');
              if (onFocusContent) onFocusContent();
            }}
            onBlur={() => setFocusedBtn(null)}
            onPress={() => {
              setIsVideoMode(true);
              setPlaying(true);
              if (onPlay) onPlay();
            }}
            style={[styles.box, focusedBtn === 'thumb' && { borderColor: '#fff', transform: [{ scale: 1.05 }] }]}
            underlayColor="transparent"
          >
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414' }}>
              <Image source={{ uri: thumbUrl }} style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} resizeMode="cover" />
              <View style={styles.playIconCircle}>
                <Text style={{ color: '#000', fontSize: 36, marginLeft: 6 }}>▶</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 18, marginTop: 16, fontWeight: 'bold' }}>PHÁT TRAILER</Text>
            </View>
          </TouchableHighlight>
        </TVFocusGuideView>
      ) : (
        <TVFocusGuideView autoFocus style={{ width: '100%', alignItems: 'center' }}>
          <View style={[styles.box, { borderColor: 'transparent' }]} pointerEvents="none">
            <WebView
              ref={webViewRef}
              source={{ html: youtubeHTML, baseUrl: 'https://lonelycpp.github.io/react-native-youtube-iframe/iframe.html' }}
              style={{ width: 640, height: 360, backgroundColor: 'black' }}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              androidLayerType="hardware"
              bounces={false}
              scrollEnabled={false}
              focusable={false}
              onMessage={(event) => {
                const msg = event.nativeEvent.data;
                if (msg.startsWith("STATE_")) {
                  const state = Number(msg.replace("STATE_", ""));
                  if (state === 0) { // ended
                    setIsVideoMode(false);
                    setPlaying(false);
                    if (onExitVideo) onExitVideo();
                  } else if (state === 1) { // playing
                    setPlaying(true);
                  } else if (state === 2) { // paused
                    setPlaying(false);
                  }
                }
              }}
            />
            {/* Overlay chặn remote */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </View>
          
          <View style={styles.controlsRow}>
            {renderNetflixButton('rewind', 'https://img.icons8.com/ios-filled/100/ffffff/replay-10.png', 'Lùi 10s', () => handleSeek(-10), rewindRef, forwardNode, playPauseNode)}
            {renderNetflixButton('play_pause', playing ? 'https://img.icons8.com/ios-filled/100/ffffff/pause--v1.png' : 'https://img.icons8.com/ios-filled/100/ffffff/play--v1.png', playing ? 'Tạm Dừng' : 'Phát Tiếp', togglePlay, playPauseRef, rewindNode, forwardNode)}
            {renderNetflixButton('forward', 'https://img.icons8.com/ios-filled/100/ffffff/forward-10.png', 'Tới 10s', () => handleSeek(10), forwardRef, playPauseNode, rewindNode)}
          </View>
        </TVFocusGuideView>
      )}
    </View>
  );
};

