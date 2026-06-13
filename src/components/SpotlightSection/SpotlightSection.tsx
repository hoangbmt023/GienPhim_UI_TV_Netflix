import React, { useState, useRef } from 'react';
import { View, Text, TouchableHighlight, Image, StyleSheet, LayoutAnimation, Platform, useWindowDimensions, Animated, FlatList, TVFocusGuideView, findNodeHandle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';
import { imgUrl, getMovieDetail, getMovieImages } from '../../services/ophimApi';
import { styles as rowStyles } from '../MovieRow/MovieRow.styles';
import { styles } from './SpotlightSection.styles';

interface SpotlightSectionProps {
  title: string;
  items: any[];
  loading?: boolean;
  nextFocusUpNode?: React.RefObject<any> | null;
  onFocusRow?: () => void;
  onLayout?: (e: any) => void;
}

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();

export const SpotlightSection = ({ title, items, loading, nextFocusUpNode, onFocusRow, onLayout }: SpotlightSectionProps) => {
  const [activeItem, setActiveItem] = useState<any>(null);
  const [movieDetails, setMovieDetails] = useState<Record<string, any>>({});
  const [movieImages, setMovieImages] = useState<Record<string, any>>({});

  const flatListRef = useRef<FlatList>(null);

  const handleFocusItem = (index: number, item: any) => {
    setActiveItem(item);
    onFocusRow?.();

    if (flatListRef.current && items.length > 0) {
      try {
        flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      } catch (e) {
        // Ignored
      }
    }
  };

  // Tương tự HeroBanner: Fetch chi tiết phim để lấy category, mô tả, nội dung...
  React.useEffect(() => {
    if (!items || items.length === 0) return;
    items.forEach(movie => {
      if (movieDetails[movie.slug]) return;
      getMovieDetail(movie.slug)
        .then(res => {
          if (res?.data?.item) {
            setMovieDetails(prev => ({ ...prev, [movie.slug]: res.data.item }));
          }
        })
        .catch(() => { });
    });
  }, [items]);

  // Tương tự HeroBanner: Fetch ảnh TMDB (backdrop, logo) để hiển thị thật đẹp
  React.useEffect(() => {
    if (!items || items.length === 0) return;
    items.forEach(movie => {
      if (movieImages[movie.slug]) return;
      getMovieImages(movie.slug)
        .then(res => {
          if (res?.success && res?.data?.images) {
            const backdrop = res.data.images.find((img: any) => img.type === 'backdrop');
            const logo = res.data.images.find((img: any) => img.type === 'logo');

            const baseUrl = res.data.image_sizes?.backdrop?.w1280 || 'https://image.tmdb.org/t/p/w1280';
            const logoUrl = res.data.image_sizes?.logo?.w500 || 'https://image.tmdb.org/t/p/w500';

            setMovieImages(prev => ({
              ...prev,
              [movie.slug]: {
                backdrop: backdrop ? `${baseUrl}${backdrop.file_path}` : null,
                logo: logo ? `${logoUrl}${logo.file_path}` : null
              }
            }));
          }
        })
        .catch(() => { });
    });
  }, [items]);

  if (loading) {
    return (
      <View style={[rowStyles.container, { marginBottom: theme.spacing.xxl * 2, paddingTop: 40 }]} onLayout={onLayout}>
        <Text style={rowStyles.rowTitle}>{title}</Text>
        <View style={[rowStyles.row, { flexDirection: 'row', paddingRight: 80, overflow: 'hidden' }]}>
          {/* Sinh ra 6 thẻ giả lập để làm khung xương */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View
              key={i}
              style={[
                styles.cardContainer,
                styles.skeletonBox,
                { width: i === 1 ? 426 : 160, height: 240, marginRight: 16 }
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <View style={[rowStyles.container, { marginBottom: theme.spacing.xxl * 2, paddingTop: 40 }]} onLayout={onLayout}>
      <Text style={rowStyles.rowTitle}>{title}</Text>

      <TVFocusGuideView autoFocus style={{ overflow: 'visible' }}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={items}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item, index }) => {
            const detail = movieDetails[item.slug] || item;
            const images = movieImages[item.slug] || {};

            return (
              <SpotlightItem
                item={detail}
                images={images}
                nextFocusUpNode={nextFocusUpNode}
                onFocusChange={(focusedItem) => handleFocusItem(index, focusedItem)}
              />
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 80, paddingRight: 80 }}
          style={{ overflow: 'visible' }}
          removeClippedSubviews={true}
          windowSize={5}
          initialNumToRender={5}
          maxToRenderPerBatch={3}
        />
      </TVFocusGuideView>

      {/* Spotlight Info Pane */}
      {activeItem && (
        <View style={styles.infoPane}>
          <Text style={styles.infoMeta}>
            {activeItem.category?.map((c: any) => c.name).join(' • ') || 'Phim'} • {activeItem.year || ''} • {activeItem.quality || 'HD'} {activeItem.episode_current ? `• ${activeItem.episode_current}` : ''}
          </Text>
          <Text style={styles.infoDesc} numberOfLines={3}>
            {stripHtml(activeItem.content || activeItem.description)}
          </Text>
        </View>
      )}
    </View>
  );
};

// Khai báo mảng gradient tĩnh bên ngoài component để tránh lỗi "Expected static flag" của React 18 / Fabric
const GRADIENT_LAYERS = Array.from({ length: 20 }).map((_, i) => {
  const opacity = Math.pow(i / 19, 2) * 0.9;
  return <View key={i} style={{ flex: 1, backgroundColor: `rgba(0,0,0,${opacity})` }} />;
});

const TouchableHighlightTV = TouchableHighlight as any;

const SpotlightItem = React.memo(({ item, images, itemRef, nextFocusUpNode, onFocusChange }: { item: any, images: any, itemRef?: any, nextFocusUpNode?: React.RefObject<any> | null, onFocusChange: (item: any) => void }) => {
  const [focused, setFocused] = useState(false);
  const navigation = useNavigation<any>();

  const handleFocus = () => {
    // Kích hoạt LayoutAnimation tự động animate chiều rộng (width)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFocused(true);
    onFocusChange(item);
  };

  const handleBlur = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFocused(false);
  };

  // Chiều cao chuẩn: 240
  // Lúc bình thường (chưa focus): Hiện Poster (Tỷ lệ 2:3) => Rộng: 160
  // Lúc được focus (banner): Hiện Thumb ngang (Tỷ lệ 16:9) => Rộng: 426
  const width = focused ? 426 : 160;
  const height = 240;

  // Lấy ảnh hiển thị (Chỉ dùng poster theo yêu cầu để tránh lag đổi ảnh)
  const posterSrc = imgUrl(item.poster_url || item.thumb_url);

  return (
    <TouchableHighlightTV
      ref={itemRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPress={() => navigation.navigate('MovieDetail', { slug: item.slug })}
      activeOpacity={1}
      underlayColor="transparent"
      style={{ marginRight: 16, borderRadius: 8 }}
      nextFocusUp={nextFocusUpNode?.current ? findNodeHandle(nextFocusUpNode.current) : undefined}
    >
      <View style={[
        styles.cardContainer,
        { width, height },
        focused && styles.cardFocused
      ]}>
        {/* Render Poster (Dùng duy nhất 1 ảnh để LayoutAnimation mượt mà, không bị lag đổi ảnh) */}
        <Image
          source={{ uri: posterSrc }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Gradient mờ mượt mà */}
        {focused && (
          <View style={StyleSheet.absoluteFill}>
            <View style={{ flex: 1 }} />
            <View style={{ height: 100 }}>
              <>{GRADIENT_LAYERS}</>
            </View>
          </View>
        )}

        {/* Lớp chứa tên phim/logo hiển thị bên trong banner khi focus */}
        {focused && (
          <View style={styles.cardOverlay}>
            {images.logo ? (
              <Image
                source={{ uri: images.logo }}
                style={{ width: '80%', height: 60, resizeMode: 'contain', marginBottom: 4 }}
              />
            ) : (
              <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableHighlightTV>
  );
});
