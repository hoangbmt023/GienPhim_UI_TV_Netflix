import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableHighlight, FlatList, findNodeHandle, BackHandler, Image, ScrollView, LayoutAnimation, UIManager, Platform, StyleSheet } from 'react-native';
import { styles } from './EpisodeSelectionUI.styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TouchableHighlightTV = TouchableHighlight as any;

interface EpisodeSelectionUIProps {
  servers: any[];
  playingEpisodeSlug?: string;
  movieTitle?: string;
  posterUrl?: string; // We'll use this as the backdrop
  currentEpisodeInfo?: string;
  totalEpisodes?: string | number;
  onPlayEpisode: (episode: any, serverName: string) => void;
  onClose?: () => void;
  onPlayMain?: () => void;
}

export const EpisodeSelectionUI = ({ servers, playingEpisodeSlug, movieTitle, posterUrl, currentEpisodeInfo, totalEpisodes, onPlayEpisode, onClose, onPlayMain }: EpisodeSelectionUIProps) => {
  const CHUNK_SIZE = 50;

  // Tính toán trước target để init state
  const initialTargets = useMemo(() => {
    let tServer = 0;
    let tRange = 0;
    let tEp = 0;
    if (playingEpisodeSlug && servers) {
      for (let sIdx = 0; sIdx < servers.length; sIdx++) {
        const eps = servers[sIdx].server_data || [];
        const epIdx = eps.findIndex((e: any) => e.slug === playingEpisodeSlug);
        if (epIdx !== -1) {
          tServer = sIdx;
          if (eps.length > CHUNK_SIZE) {
            tRange = Math.floor(epIdx / CHUNK_SIZE);
            tEp = epIdx % CHUNK_SIZE;
          } else {
            tEp = epIdx;
          }
          break;
        }
      }
    }
    return { tServer, tRange, tEp };
  }, [playingEpisodeSlug, servers]);

  const [selectedServerIdx, setSelectedServerIdx] = useState(initialTargets.tServer);
  const [selectedRangeIdx, setSelectedRangeIdx] = useState(initialTargets.tRange);
  
  const [focusedTier, setFocusedTier] = useState<'play' | 'server' | 'range' | 'grid' | null>('grid');
  const [focusedIdx, setFocusedIdx] = useState<{server: number | null, range: number | null, grid: number | null}>({
    server: null, range: null, grid: initialTargets.tEp
  });

  const serverRefs = useRef<any[]>([]);
  const rangeRefs = useRef<any[]>([]);
  const gridRefs = useRef<any[]>([]);
  
  const activeServer = servers[selectedServerIdx] || servers[0];
  const episodes = activeServer?.server_data || [];
  
  const ranges = useMemo(() => {
    if (episodes.length <= CHUNK_SIZE) return [];
    const _ranges = [];
    for (let i = 0; i < episodes.length; i += CHUNK_SIZE) {
      const end = Math.min(i + CHUNK_SIZE, episodes.length);
      _ranges.push({
        label: `Tập ${i + 1}-${end}`,
        startIndex: i,
        endIndex: end,
        episodes: episodes.slice(i, end)
      });
    }
    return _ranges;
  }, [episodes]);

  const activeEpisodes = ranges.length > 0 ? ranges[selectedRangeIdx]?.episodes || [] : episodes;
  const activeStartIndex = ranges.length > 0 ? ranges[selectedRangeIdx]?.startIndex || 0 : 0;

  // Find index of playing episode to mock watched state
  const playingAbsoluteIndex = useMemo(() => {
    if (!playingEpisodeSlug) return -1;
    let idx = -1;
    servers.forEach(s => {
      const eps = s.server_data || [];
      const i = eps.findIndex((e: any) => e.slug === playingEpisodeSlug);
      if (i !== -1) idx = i;
    });
    return idx;
  }, [playingEpisodeSlug, servers]);

  // Back Handler for modal navigation
  useEffect(() => {
    const backAction = () => {
      if (focusedTier === 'grid') {
        if (ranges.length > 0) {
          rangeRefs.current[selectedRangeIdx]?.focus();
        } else if (servers.length > 1) {
          serverRefs.current[selectedServerIdx]?.focus();
        } else {
          if (onClose) onClose();
        }
        return true;
      }
      if (focusedTier === 'range') {
        if (servers.length > 1) {
          serverRefs.current[selectedServerIdx]?.focus();
        } else {
          if (onClose) onClose();
        }
        return true;
      }
      if (focusedTier === 'server') {
        if (onClose) onClose();
        return true;
      }
      if (focusedTier === 'play') {
        if (onClose) onClose();
        return true;
      }
      // If we are somewhat stuck, let's close modal anyway on back
      if (onClose) onClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [focusedTier, ranges.length, servers.length, selectedRangeIdx, selectedServerIdx, onClose]);

  const handleFocus = useCallback((tier: 'play' | 'server' | 'range' | 'grid', index: number) => {
    setFocusedTier(tier);
    if (tier !== 'play') {
      setFocusedIdx(prev => ({ ...prev, [tier]: index }));
    }
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedTier(null);
  }, []);

  if (!servers || servers.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* BANNER HEADER */}
      <View style={styles.bannerContainer}>
        {posterUrl && <Image source={{ uri: posterUrl }} style={styles.bannerImage} />}
        <View style={styles.bannerGradient} />
        <View style={styles.bannerContent}>
          {movieTitle && <Text style={styles.movieTitle} numberOfLines={1}>{movieTitle}</Text>}
          <View style={styles.metadataRow}>
            {currentEpisodeInfo && <Text style={styles.episodeInfo}>{currentEpisodeInfo}</Text>}
            {totalEpisodes && (
              <View style={styles.episodeCountBadge}>
                <Text style={styles.episodeCountText}>{String(totalEpisodes).includes('Tập') ? totalEpisodes : `${totalEpisodes} Tập`}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.contentContainer}>
        {/* SERVER SELECTOR */}
        {servers.length > 1 && (
          <FlatList
            horizontal
            data={servers}
            keyExtractor={(s, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorRow}
            renderItem={({ item, index }) => {
              const isSelected = selectedServerIdx === index;
              const isFocused = focusedIdx.server === index && focusedTier === 'server';
              return (
                <TouchableHighlightTV
                  ref={(el: any) => serverRefs.current[index] = el}
                  onFocus={() => handleFocus('server', index)}
                  onBlur={handleBlur}
                  onPress={() => {
                    setSelectedServerIdx(index);
                    setSelectedRangeIdx(0);
                  }}
                  style={[
                    styles.selectorBtn,
                    isSelected && !isFocused && styles.selectorBtnSelected,
                    !isSelected && isFocused && styles.selectorBtnFocused,
                    isSelected && isFocused && styles.selectorBtnSelectedFocused
                  ]}
                  underlayColor="#fff"
                  nextFocusDown={ranges.length > 0 ? (rangeRefs.current[selectedRangeIdx] ? findNodeHandle(rangeRefs.current[selectedRangeIdx]) : undefined) : (gridRefs.current[initialTargets.tEp] ? findNodeHandle(gridRefs.current[initialTargets.tEp]) : undefined)}
                >
                  <Text style={[styles.selectorText, isSelected && styles.selectorTextSelected, !isSelected && isFocused && styles.selectorTextFocused]}>{item.server_name}</Text>
                </TouchableHighlightTV>
              );
            }}
          />
        )}

        {/* RANGE SELECTOR */}
        {ranges.length > 0 && (
          <FlatList
            horizontal
            data={ranges}
            keyExtractor={(r, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorRow}
            renderItem={({ item, index }) => {
              const isSelected = selectedRangeIdx === index;
              const isFocused = focusedIdx.range === index && focusedTier === 'range';
              return (
                <TouchableHighlightTV
                  ref={(el: any) => rangeRefs.current[index] = el}
                  onFocus={() => handleFocus('range', index)}
                  onBlur={handleBlur}
                  onPress={() => setSelectedRangeIdx(index)}
                  style={[
                    styles.selectorBtn,
                    isSelected && !isFocused && styles.selectorBtnSelected,
                    !isSelected && isFocused && styles.selectorBtnFocused,
                    isSelected && isFocused && styles.selectorBtnSelectedFocused
                  ]}
                  underlayColor="#fff"
                  nextFocusUp={servers.length > 1 ? (serverRefs.current[selectedServerIdx] ? findNodeHandle(serverRefs.current[selectedServerIdx]) : undefined) : undefined}
                  nextFocusDown={gridRefs.current[initialTargets.tEp] ? findNodeHandle(gridRefs.current[initialTargets.tEp]) : undefined}
                >
                  <Text style={[styles.selectorText, isSelected && styles.selectorTextSelected, !isSelected && isFocused && styles.selectorTextFocused]}>{item.label}</Text>
                </TouchableHighlightTV>
              );
            }}
          />
        )}

        {/* EPISODE GRID */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={true} indicatorStyle="white">
          {activeEpisodes.length === 0 || (activeEpisodes.length === 1 && (!activeEpisodes[0].name || activeEpisodes[0].name.trim() === '')) ? (
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <Text style={{ color: '#aaa', fontSize: 24, fontStyle: 'italic' }}>
                Phim hiện chưa có tập (hoặc chỉ có trailer).
              </Text>
            </View>
          ) : (
            activeEpisodes.map((ep: any, index: number) => {
              // Nếu tập không có tên, bỏ qua
              if (!ep.name || ep.name.trim() === '') return null;

              const absoluteIndex = activeStartIndex + index;
              const isPlaying = ep.slug === playingEpisodeSlug;
              const isFocused = focusedIdx.grid === index && focusedTier === 'grid';
              const isWatched = playingAbsoluteIndex !== -1 && absoluteIndex < playingAbsoluteIndex;
              const isTarget = index === initialTargets.tEp;
              
              return (
                <TouchableHighlightTV
                  key={`${ep.slug || ep.name || ''}_${absoluteIndex}`}
                  ref={(el: any) => gridRefs.current[index] = el}
                  hasTVPreferredFocus={isTarget}
                  onFocus={() => handleFocus('grid', index)}
                  onBlur={handleBlur}
                  onPress={() => onPlayEpisode(ep, activeServer.server_name)}
                  style={styles.epBoxWrapper}
                  underlayColor="transparent"
                  nextFocusUp={
                    index < 5 // 5 columns
                      ? (ranges.length > 0 
                          ? (rangeRefs.current[selectedRangeIdx] ? findNodeHandle(rangeRefs.current[selectedRangeIdx]) : undefined) 
                          : (servers.length > 1 ? (serverRefs.current[selectedServerIdx] ? findNodeHandle(serverRefs.current[selectedServerIdx]) : undefined) : undefined))
                      : undefined
                  }
                >
                  <View style={[
                    styles.epBox,
                    isPlaying && styles.epBoxPlaying,
                    isFocused && styles.epBoxFocused
                  ]}>
                    <Text style={styles.epNumberText}>{ep.name}</Text>
                    {isPlaying && <Text style={styles.playingText}>Đang Phát</Text>}
                    {isWatched && !isPlaying && (
                      <Image 
                        source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/checkmark.png' }} 
                        style={styles.checkIcon} 
                      />
                    )}
                  </View>
                </TouchableHighlightTV>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
};
