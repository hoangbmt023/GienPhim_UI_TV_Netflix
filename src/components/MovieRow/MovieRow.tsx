import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableHighlight, Image, Animated, useWindowDimensions, StyleSheet, FlatList, TVFocusGuideView, findNodeHandle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';
import { imgUrl } from '../../services/ophimApi';
import { styles } from './MovieRow.styles';

interface MovieRowProps {
  title: string;
  items: any[];
  loading?: boolean;
  onFocusRow?: () => void;
  onLayout?: (e: any) => void;
  isTop10?: boolean;
  nextFocusUpNode?: number | null;
}

// Khai báo mảng gradient tĩnh bên ngoài component để tránh lỗi "Expected static flag" của React 18 / Fabric
const GRADIENT_LAYERS = Array.from({ length: 20 }).map((_, i) => {
  const opacity = Math.pow(i / 19, 2) * 0.9;
  return <View key={i} style={{ flex: 1, backgroundColor: `rgba(0,0,0,${opacity})` }} />;
});

export const MovieRow = ({ title, items, loading, onFocusRow, onLayout, isTop10, nextFocusUpNode }: MovieRowProps) => {
  if (loading) {
    return (
      <View style={styles.container} onLayout={onLayout}>
        <Text style={styles.rowTitle}>{title}</Text>
        <View style={{ flexDirection: 'row', paddingLeft: 80 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      </View>
    );
  }

  if (!items || items.length === 0) return null;

  const flatListRef = useRef<FlatList>(null);

  const handleFocusItem = (index: number) => {
    onFocusRow?.();

    // Sử dụng scrollToIndex của FlatList với viewPosition: 0.5 để canh giữa hoàn hảo
    if (flatListRef.current && items.length > 0) {
      try {
        flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      } catch (e) {
        // Ignored if index out of range during layout
      }
    }
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Text style={styles.rowTitle}>{title}</Text>
      <TVFocusGuideView autoFocus style={{ overflow: 'visible' }}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={items}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item, index }) => (
            <MovieCard
              item={item}
              index={index}
              isTop10={isTop10}
              totalItems={items.length}
              onFocusChange={() => handleFocusItem(index)}
              nextFocusUpNode={nextFocusUpNode}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 80, paddingRight: 80 }}
          style={{ overflow: 'visible' }}
          removeClippedSubviews={true}
          windowSize={5}
          initialNumToRender={5}
          maxToRenderPerBatch={3}
        />
      </TVFocusGuideView>
    </View>
  );
};

// Offset mượt hơn: 12 điểm gần nhau để viền tròn đều
const STROKE_OFFSETS: [number, number][] = [
  [-3, 0], [3, 0], [0, -3], [0, 3],
  [-2, -2], [2, -2], [-2, 2], [2, 2],
  [-3, -1], [3, 1], [-1, -3], [1, 3],
];

const MovieCard = React.memo(({ item, index, isTop10, totalItems, onFocusChange, nextFocusUpNode }: { item: any, index: number, isTop10?: boolean, totalItems: number, onFocusChange: () => void, nextFocusUpNode?: number | null }) => {
  const [focused, setFocused] = useState(false);
  const navigation = useNavigation<any>();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cardRef = useRef<any>(null);
  const [nodeHandle, setNodeHandle] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (cardRef.current) {
        setNodeHandle(findNodeHandle(cardRef.current));
      }
    }, 100);
  }, []);

  const handleFocus = () => {
    setFocused(true);
    onFocusChange();
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  return (
    // zIndex cao khi focus → card này đè lên số của card bên cạnh
    <View style={{ overflow: 'visible', zIndex: focused ? 10 : 1 }}>
      <TouchableHighlight
        ref={cardRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPress={() => navigation.navigate('MovieDetail', { slug: item.slug })}
        activeOpacity={1}
        underlayColor="transparent"
        style={{ marginRight: theme.spacing.m }}
        nextFocusUp={nextFocusUpNode}
        nextFocusLeft={index === 0 ? (nodeHandle || undefined) : undefined}
        nextFocusRight={index === totalItems - 1 ? (nodeHandle || undefined) : undefined}
      >
        {/* Animated.View phải overflow visible để số nhô ra ngoài */}
        <Animated.View style={[
          styles.card,
          focused && styles.cardFocused,
          { transform: [{ scale: scaleAnim }], overflow: 'visible' }
        ]}>
          {/* Số Top nằm trong Animated.View → tự scale theo card */}
          {isTop10 && (
            <View style={styles.topNumberWrapper} pointerEvents="none">
              {STROKE_OFFSETS.map(([dx, dy], i) => (
                <Text key={i} style={[
                  styles.topNumberStroke,
                  { left: (index >= 9 ? -75 : -45) + dx, bottom: dy, letterSpacing: -12 },
                  focused && styles.topNumberStrokeFocused
                ]}>
                  {index + 1}
                </Text>
              ))}
              {/* Số chính (màu tối nằm trên cùng) */}
              <Text style={[styles.topNumber, { left: index >= 9 ? -75 : -45, letterSpacing: -12 }, focused && styles.topNumberFocused]}>
                {index + 1}
              </Text>
            </View>
          )}

          {/* Nội dung card */}
          <View style={styles.cardInner}>
            <Image
              source={{ uri: imgUrl(item.poster_url || item.thumb_url) }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.badgeHD}>
              <Text style={styles.badgeHDText}>{item.quality || 'HD'}</Text>
            </View>
            <View style={styles.badgeEp}>
              <Text style={styles.badgeEpText}>{item.episode_current || 'Tập 1'}</Text>
            </View>
            {focused && (
              <View style={StyleSheet.absoluteFill}>
                <View style={{ flex: 1 }} />
                <View style={{ height: '60%' }}>
                  <>{GRADIENT_LAYERS}</>
                </View>
              </View>
            )}
            {focused && (
              <View style={[styles.cardOverlay, isTop10 && { paddingLeft: index >= 9 ? 75 : 34 }]}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableHighlight>
    </View>
  );
});

