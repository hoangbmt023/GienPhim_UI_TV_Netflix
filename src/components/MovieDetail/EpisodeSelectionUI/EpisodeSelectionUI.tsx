import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableHighlight, FlatList, findNodeHandle, BackHandler, Image } from 'react-native';
import { styles } from './EpisodeSelectionUI.styles';

const TouchableHighlightTV = TouchableHighlight as any;

interface EpisodeSelectionUIProps {
  servers: any[];
  playingEpisodeSlug?: string;
  onPlayEpisode: (episode: any, serverName: string) => void;
  onClose?: () => void;
  onPlayMain?: () => void;
}

export const EpisodeSelectionUI = ({ servers, playingEpisodeSlug, onPlayEpisode, onClose, onPlayMain }: EpisodeSelectionUIProps) => {
  const [selectedServerIdx, setSelectedServerIdx] = useState(0);
  const [selectedRangeIdx, setSelectedRangeIdx] = useState(0);
  
  const [focusedTier, setFocusedTier] = useState<'play' | 'server' | 'range' | 'grid' | null>(null);
  const [focusedIdx, setFocusedIdx] = useState<{server: number | null, range: number | null, grid: number | null}>({
    server: null, range: null, grid: null
  });

  const internalPlayBtnRef = useRef<any>(null);
  const serverRefs = useRef<any[]>([]);
  const rangeRefs = useRef<any[]>([]);
  const gridRefs = useRef<any[]>([]);
  
  const CHUNK_SIZE = 60;

  // Update ranges
  const activeServer = servers[selectedServerIdx];
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

  // Auto-select on mount
  useEffect(() => {
    if (!playingEpisodeSlug) return;
    for (let sIdx = 0; sIdx < servers.length; sIdx++) {
      const eps = servers[sIdx].server_data || [];
      const epIdx = eps.findIndex((e: any) => e.slug === playingEpisodeSlug);
      if (epIdx !== -1) {
        setSelectedServerIdx(sIdx);
        if (eps.length > CHUNK_SIZE) {
          const rIdx = Math.floor(epIdx / CHUNK_SIZE);
          setSelectedRangeIdx(rIdx);
        }
        break;
      }
    }
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
          internalPlayBtnRef.current?.focus();
        }
        return true;
      }
      if (focusedTier === 'range') {
        if (servers.length > 1) {
          serverRefs.current[selectedServerIdx]?.focus();
        } else {
          internalPlayBtnRef.current?.focus();
        }
        return true;
      }
      if (focusedTier === 'server') {
        internalPlayBtnRef.current?.focus();
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
    
    if (tier === 'server') {
      setSelectedServerIdx(index);
      setSelectedRangeIdx(0);
    } else if (tier === 'range') {
      setSelectedRangeIdx(index);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedTier(null);
  }, []);

  if (!servers || servers.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* PLAY BUTTON (TOP LEVEL) */}
      <TouchableHighlightTV
        hasTVPreferredFocus
        ref={internalPlayBtnRef}
        onFocus={() => handleFocus('play', 0)}
        onBlur={handleBlur}
        onPress={() => onPlayMain && onPlayMain()}
        style={[
          { paddingVertical: 15, paddingHorizontal: 30, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, alignSelf: 'flex-start', marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
          focusedTier === 'play' && { backgroundColor: '#e50914', transform: [{ scale: 1.05 }] }
        ]}
        underlayColor="#E50914"
        nextFocusDown={servers.length > 1 ? (serverRefs.current[selectedServerIdx] ? findNodeHandle(serverRefs.current[selectedServerIdx]) : undefined) : (ranges.length > 0 ? (rangeRefs.current[selectedRangeIdx] ? findNodeHandle(rangeRefs.current[selectedRangeIdx]) : undefined) : (gridRefs.current[0] ? findNodeHandle(gridRefs.current[0]) : undefined))}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/play--v1.png' }} style={{ width: 24, height: 24, marginRight: 10 }} />
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>PHÁT PHIM</Text>
        </View>
      </TouchableHighlightTV>

      {/* SERVER SELECTOR */}
      {servers.length > 1 && (
        <FlatList
          horizontal
          data={servers}
          keyExtractor={(s, i) => i.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorRow}
          renderItem={({ item, index }) => (
            <TouchableHighlightTV
              ref={(el: any) => serverRefs.current[index] = el}
              onFocus={() => handleFocus('server', index)}
              onBlur={handleBlur}
              onPress={() => {}}
              style={[
                styles.selectorBtn,
                selectedServerIdx === index && styles.selectorBtnSelected,
                focusedIdx.server === index && focusedTier === 'server' && styles.selectorBtnFocused
              ]}
              underlayColor="transparent"
              nextFocusUp={internalPlayBtnRef.current ? findNodeHandle(internalPlayBtnRef.current) : undefined}
              nextFocusDown={ranges.length > 0 ? (rangeRefs.current[selectedRangeIdx] ? findNodeHandle(rangeRefs.current[selectedRangeIdx]) : undefined) : (gridRefs.current[0] ? findNodeHandle(gridRefs.current[0]) : undefined)}
            >
              <Text style={styles.selectorText}>{item.server_name}</Text>
            </TouchableHighlightTV>
          )}
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
          renderItem={({ item, index }) => (
            <TouchableHighlightTV
              ref={(el: any) => rangeRefs.current[index] = el}
              onFocus={() => handleFocus('range', index)}
              onBlur={handleBlur}
              onPress={() => {}}
              style={[
                styles.selectorBtn,
                selectedRangeIdx === index && styles.selectorBtnSelected,
                focusedIdx.range === index && focusedTier === 'range' && styles.selectorBtnFocused
              ]}
              underlayColor="transparent"
              nextFocusUp={servers.length > 1 ? (serverRefs.current[selectedServerIdx] ? findNodeHandle(serverRefs.current[selectedServerIdx]) : undefined) : (internalPlayBtnRef.current ? findNodeHandle(internalPlayBtnRef.current) : undefined)}
              nextFocusDown={gridRefs.current[0] ? findNodeHandle(gridRefs.current[0]) : undefined}
            >
              <Text style={styles.selectorText}>{item.label}</Text>
            </TouchableHighlightTV>
          )}
        />
      )}

      {/* EPISODE GRID */}
      <View style={styles.gridContainer}>
        {activeEpisodes.map((ep: any, index: number) => {
          const absoluteIndex = activeStartIndex + index;
          const isPlaying = ep.slug === playingEpisodeSlug;
          
          return (
            <TouchableHighlightTV
              key={`${ep.slug || ep.name || ''}_${absoluteIndex}`}
              ref={(el: any) => gridRefs.current[index] = el}
              onFocus={() => handleFocus('grid', index)}
              onBlur={handleBlur}
              onPress={() => onPlayEpisode(ep, activeServer.server_name)}
              style={[
                styles.epBox,
                isPlaying && styles.epBoxPlaying,
                focusedIdx.grid === index && focusedTier === 'grid' && styles.epBoxFocused
              ]}
              underlayColor="transparent"
              nextFocusUp={
                index < 6 
                  ? (ranges.length > 0 
                      ? (rangeRefs.current[selectedRangeIdx] ? findNodeHandle(rangeRefs.current[selectedRangeIdx]) : undefined) 
                      : (servers.length > 1 ? (serverRefs.current[selectedServerIdx] ? findNodeHandle(serverRefs.current[selectedServerIdx]) : undefined) : (internalPlayBtnRef.current ? findNodeHandle(internalPlayBtnRef.current) : undefined)))
                  : undefined
              }
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.epNumberText}>{ep.name}</Text>
                {isPlaying && <Text style={styles.playingText}>Đang Phát</Text>}
              </View>
            </TouchableHighlightTV>
          );
        })}
      </View>
    </View>
  );
};
