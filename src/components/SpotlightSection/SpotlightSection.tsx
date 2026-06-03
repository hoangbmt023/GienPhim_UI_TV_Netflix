import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableHighlight, Image, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';
import { theme } from '../../constants/theme';
import { imgUrl, getMovieDetail, getMovieImages } from '../../services/ophimApi';
import { styles as rowStyles } from '../MovieRow/MovieRow.styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SpotlightSectionProps {
  title: string;
  items: any[];
  loading?: boolean;
  firstItemRef?: React.MutableRefObject<any> | null;
  onFocusRow?: () => void;
}

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();

export const SpotlightSection = ({ title, items, loading, firstItemRef, onFocusRow }: SpotlightSectionProps) => {
  const [activeItem, setActiveItem] = useState<any>(null);
  const [movieDetails, setMovieDetails] = useState<Record<string, any>>({});
  const [movieImages, setMovieImages] = useState<Record<string, any>>({});

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
      <View style={rowStyles.container}>
        <Text style={rowStyles.rowTitle}>{title}</Text>
        <Text style={{ color: theme.colors.textMuted, marginLeft: theme.spacing.xxl }}>Đang tải...</Text>
      </View>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <View style={[rowStyles.container, { marginBottom: theme.spacing.xxl * 2, paddingTop: 40 }]}>
      <Text style={rowStyles.rowTitle}>{title}</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={rowStyles.row}
        contentContainerStyle={{ paddingRight: 80 }}
      >
        {items.map((item, index) => {
          const detail = movieDetails[item.slug] || item;
          const images = movieImages[item.slug] || {};

          return (
            <SpotlightItem
              key={item._id || index}
              item={detail}
              images={images}
              itemRef={index === 0 ? firstItemRef : null}
              onFocusChange={(focusedItem) => {
                setActiveItem(focusedItem);
                onFocusRow?.();
              }}
            />
          );
        })}
      </ScrollView>

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

const SpotlightItem = ({ item, images, itemRef, onFocusChange }: { item: any, images: any, itemRef?: any, onFocusChange: (item: any) => void }) => {
  const [focused, setFocused] = useState(false);

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

  // Lấy ảnh hiển thị
  const posterSrc = imgUrl(item.poster_url || item.thumb_url);
  const bannerSrc = images.backdrop || imgUrl(item.thumb_url);

  // Gradient mượt mà với 20 lớp (layer)
  const gradientLayers = Array.from({ length: 20 }).map((_, i) => {
    // Hàm mũ 2 tạo đường cong gradient đẹp như CSS ease
    const opacity = Math.pow(i / 19, 2) * 0.9;
    return <View key={i} style={{ flex: 1, backgroundColor: `rgba(0,0,0,${opacity})` }} />;
  });

  return (
    <TouchableHighlight
      ref={itemRef}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPress={() => { }}
      activeOpacity={1}
      underlayColor="transparent"
      style={{ marginRight: 16, borderRadius: 8 }}
    >
      <View style={[
        styles.cardContainer,
        { width, height },
        focused && styles.cardFocused
      ]}>
        {/* Render Poster nằm dưới (Luôn hiện) */}
        <Image
          source={{ uri: posterSrc }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Render Banner nằm trên, chỉ hiện khi focused */}
        {focused && (
          <Image
            source={{ uri: bannerSrc }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        )}

        {/* Gradient mờ mượt mà */}
        {focused && (
          <View style={StyleSheet.absoluteFill}>
            <View style={{ flex: 1 }} />
            <View style={{ height: 100 }}>
              {gradientLayers}
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
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: '#333',
  },
  cardFocused: {
    borderColor: '#fff',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent', // Đã chuyển sang dùng Gradient giả lập ở trên
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900', // Đậm hơn
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  infoPane: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: 80, // Bằng đúng marginLeft của Title và Row để canh lề chuẩn
    maxWidth: '75%', // Rộng ra tí để chữ đỡ bị rớt dòng nhiều
  },
  infoMeta: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoDesc: {
    color: '#ccc',
    fontSize: 18,
    lineHeight: 28,
  }
});
