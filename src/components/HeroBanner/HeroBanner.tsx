import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableHighlight, Animated, Image, findNodeHandle, StyleSheet, ScrollView } from 'react-native';
import { imgUrl, getMovieImages, getMovieDetail } from '../../services/ophimApi';
import { styles } from './HeroBanner.styles';

interface HeroBannerProps {
  movies: any[];
  loading?: boolean;
  containerHeight?: number;
  onFocusBanner?: () => void;
  nextFocusUpNode?: React.MutableRefObject<any> | null;
  nextFocusDownNode?: React.MutableRefObject<any> | null;
}

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();
const TouchableHighlightTV = TouchableHighlight as any;

export const HeroBanner = ({ movies, loading, containerHeight, onFocusBanner, nextFocusUpNode, nextFocusDownNode }: HeroBannerProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [focusedBtn, setFocusedBtn] = useState<string | null>(null);
  const [focusedThumb, setFocusedThumb] = useState<number | null>(null);
  const [backdropCache, setBackdropCache] = useState<Record<string, string>>({});
  const [movieDetails, setMovieDetails] = useState<Record<string, any>>({});

  // Refs for custom focus navigation and animations
  const playBtnRef = useRef<any>(null);
  const infoBtnRef = useRef<any>(null);
  const thumbRefs = useRef<any[]>([]);
  const mountTimeRef = useRef(Date.now());
  const lastInteractionRef = useRef(Date.now());
  const hasInteractedRef = useRef(false);

  const thumbScrollRef = useRef<ScrollView>(null);

  // Only take 8 movies for the hero banner strip
  const items = useMemo(() => movies.slice(0, 8), [movies]);

  // Create 8 animated values for crossfading the 8 backdrops
  const fadeAnims = useRef(
    Array(8).fill(0).map(() => new Animated.Value(0))
  ).current;

  const interact = () => {
    // Không tính là tương tác nếu tự động focus khi vừa mở app (trong vòng 1s đầu)
    if (Date.now() - mountTimeRef.current < 1000) return;
    hasInteractedRef.current = true;
    lastInteractionRef.current = Date.now();
  };

  // Fetch full details of the hero movies
  useEffect(() => {
    if (!items.length) return;
    items.forEach(movie => {
      if (movieDetails[movie.slug]) return;
      getMovieDetail(movie.slug)
        .then(res => {
          if (res?.data?.item) {
            setMovieDetails(prev => ({ ...prev, [movie.slug]: res.data.item }));
          }
        })
        .catch(err => console.error(err));
    });
  }, [items]);

  // Fetch backdrops from TMDB
  useEffect(() => {
    if (!items.length) return;
    items.forEach(movie => {
      if (backdropCache[movie.slug]) return;

      getMovieImages(movie.slug)
        .then(res => {
          if (res?.success && res?.data?.images) {
            const backdrop = res.data.images.find((img: any) => img.type === 'backdrop');
            if (backdrop) {
              // Sử dụng đúng kích thước w1280 theo yêu cầu để đảm bảo độ sắc nét trên TV 1080p
              const baseUrl = res.data.image_sizes?.backdrop?.w1280 || 'https://image.tmdb.org/t/p/w1280';
              const fullUrl = `${baseUrl}${backdrop.file_path}`;
              setBackdropCache(prev => ({ ...prev, [movie.slug]: fullUrl }));
            }
          }
        })
        .catch(() => { });
    });
  }, [items]);

  // Smooth Crossfade Animation triggers when activeIdx changes
  useEffect(() => {
    if (!items.length) return;

    const animations = items.map((_, idx) => {
      return Animated.timing(fadeAnims[idx], {
        toValue: idx === activeIdx ? 1 : 0,
        duration: 400, // Tăng tốc độ mờ dần (chuyển đổi) để mượt và dứt khoát hơn
        useNativeDriver: true,
      });
    });

    Animated.parallel(animations).start();
  }, [activeIdx, items]);

  // Auto-advance
  useEffect(() => {
    if (!items || items.length === 0) return;

    const checkAndAdvance = () => {
      const now = Date.now();
      // Mới vô thì 5s chuyển phim một lần. Nếu người dùng chọn vô (focus) thì chờ 12s mới chuyển tiếp để họ kịp đọc.
      const delay = hasInteractedRef.current ? 12000 : 5000;

      if (now - lastInteractionRef.current >= delay) {
        setActiveIdx((prev) => (prev + 1) % items.length);
        hasInteractedRef.current = false; // Reset lại trạng thái để quay về 5s
        lastInteractionRef.current = Date.now();
      }
    };

    const interval = setInterval(checkAndAdvance, 2000);
    return () => clearInterval(interval);
  }, [items]);

  // Align focused thumbnail
  useEffect(() => {
    if (focusedThumb !== null && focusedThumb !== activeIdx) {
      thumbRefs.current[activeIdx]?.focus();
    }
    // Scroll the horizontal thumbnail list to ensure the active item is visible
    if (thumbScrollRef.current) {
      // 84 is width (76) + marginHorizontal (4*2)
      thumbScrollRef.current.scrollTo({
        x: Math.max(0, activeIdx * 84 - 84),
        animated: true,
      });
    }
  }, [activeIdx, focusedThumb]);

  if (loading || !movies || movies.length === 0) {
    return (
      <View style={[styles.heroBanner, containerHeight ? { height: containerHeight } : null]}>
        {/* Skeleton Backdrop */}
        <View style={styles.skeletonBackdrop} />
        <View style={styles.overlay} />

        <View style={styles.mainRow}>
          <View style={styles.leftColumn}>
            {/* Badges Skeleton */}
            <View style={styles.badgesRow}>
              <View style={[styles.badge, styles.skeletonBox, styles.skeletonBadge1]} />
              <View style={[styles.badge, styles.skeletonBox, styles.skeletonBadge2]} />
              <View style={[styles.badge, styles.skeletonBox, styles.skeletonBadge3]} />
            </View>

            {/* Title Skeleton */}
            <View style={[styles.skeletonBox, styles.skeletonTitle1]} />
            <View style={[styles.skeletonBox, styles.skeletonTitle2]} />

            {/* Meta Skeleton */}
            <View style={styles.metaRow}>
              <View style={[styles.skeletonBox, styles.skeletonMeta1]} />
              <View style={[styles.skeletonBox, styles.skeletonMeta2]} />
              <View style={[styles.skeletonBox, styles.skeletonMeta3]} />
            </View>

            {/* Description Skeleton */}
            <View style={[styles.skeletonBox, styles.skeletonDesc1]} />
            <View style={[styles.skeletonBox, styles.skeletonDesc2]} />
            <View style={[styles.skeletonBox, styles.skeletonDesc3]} />

            {/* Buttons Skeleton */}
            <View style={styles.buttonRow}>
              <View style={[styles.button, styles.skeletonBox, styles.skeletonBtn1]} />
              <View style={[styles.button, styles.skeletonBox, styles.skeletonBtn2]} />
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.thumbsContainer}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={[styles.thumbWrap, styles.skeletonBox]} />
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  const movie = items[activeIdx];
  const detail = movieDetails[movie.slug] || movie;
  const desc = stripHtml(detail?.content || detail?.description || '');

  const getPlayBtnNode = () => findNodeHandle(playBtnRef.current);
  const getInfoBtnNode = () => findNodeHandle(infoBtnRef.current);
  const getThumbNode = (index: number) => findNodeHandle(thumbRefs.current[index]);

  return (
    <View style={[styles.heroBanner, containerHeight ? { height: containerHeight } : null]}>
      {/* Background Images with Animated Crossfade */}
      {items.map((m, i) => {
        const mDetail = movieDetails[m.slug] || m;
        // Cực kỳ quan trọng: Background lớn PHẢI ƯU TIÊN HÌNH NGANG (thumb_url) thay vì dọc (poster_url).
        // Nếu xài poster (dọc), khi fill 16:9 nó sẽ bị zoom to đùng, tạo ra cảm giác "giật phát" khi ảnh TMDB (ngang) load xong.
        const fallbackUrl = imgUrl(mDetail.thumb_url || m.thumb_url || mDetail.poster_url);
        const tmdbUrl = backdropCache[m.slug];

        return (
          <Animated.View
            key={m._id || i}
            style={[
              styles.backdropImage,
              { opacity: fadeAnims[i] }
            ]}
          >
            <Image
              source={{ uri: tmdbUrl || fallbackUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          </Animated.View>
        );
      })}

      {/* Dark Overlay */}
      <View style={styles.overlay} />

      <View style={styles.mainRow}>
        <View style={styles.leftColumn}>
          <View style={styles.badgesRow}>
            <View style={[styles.badge, styles.badgeHD]}>
              <Text style={styles.badgeText}>{detail.quality || 'HD'}</Text>
            </View>
            <View style={[styles.badge, styles.badgeSub]}>
              <Text style={[styles.badgeText, styles.badgeSubText]}>{detail.lang || 'Vietsub'}</Text>
            </View>
            {detail.episode_current && (
              <View style={[styles.badge, styles.badgeEp]}>
                <Text style={[styles.badgeText, styles.badgeEpText]}>{detail.episode_current}</Text>
              </View>
            )}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{detail.year || '2026'}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle} numberOfLines={2}>
            {detail.name}
          </Text>

          <View style={styles.metaRow}>
            {detail.time && <Text style={styles.metaText}>{detail.time}</Text>}
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{detail.country?.map((c: any) => c.name).join(', ') || 'Âu Mỹ'}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={[styles.metaText, { color: '#f5c518', fontWeight: 'bold' }]}>
              IMDB {detail.imdb?.vote_average || '9.0'}
            </Text>
          </View>

          <Text style={styles.heroDesc} numberOfLines={3}>
            {desc}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableHighlightTV
              ref={playBtnRef}
              style={[
                styles.button,
                styles.buttonPrimary,
                focusedBtn === 'play' && styles.buttonFocused
              ]}
              underlayColor="#ff0a16"
              onFocus={() => {
                setFocusedBtn('play');
                interact();
                onFocusBanner?.();
              }}
              onBlur={() => setFocusedBtn(null)}
              onPress={() => { }}
              activeOpacity={1}
              hasTVPreferredFocus
              nextFocusUp={getThumbNode(activeIdx)}
              nextFocusDown={nextFocusDownNode?.current ? findNodeHandle(nextFocusDownNode.current) : undefined}
              nextFocusRight={getInfoBtnNode()}
              nextFocusLeft={getInfoBtnNode()}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/play--v1.png' }}
                  style={{ width: 22, height: 22, marginRight: 8, tintColor: '#fff' }}
                />
                <Text style={styles.buttonTextPrimary}>PHÁT</Text>
              </View>
            </TouchableHighlightTV>

            <TouchableHighlightTV
              ref={infoBtnRef}
              style={[
                styles.button,
                styles.buttonSecondary,
                focusedBtn === 'info' && styles.buttonFocused
              ]}
              underlayColor="#888"
              onFocus={() => {
                setFocusedBtn('info');
                interact();
                onFocusBanner?.();
              }}
              onBlur={() => setFocusedBtn(null)}
              onPress={() => { }}
              activeOpacity={1}
              nextFocusUp={getThumbNode(activeIdx)}
              nextFocusDown={nextFocusDownNode?.current ? findNodeHandle(nextFocusDownNode.current) : undefined}
              nextFocusLeft={getPlayBtnNode()}
              nextFocusRight={getPlayBtnNode()}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.buttonTextSecondary}>CHI TIẾT</Text>
              </View>
            </TouchableHighlightTV>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <ScrollView
            ref={thumbScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbsContainer}
          // Màn hình hiển thị tầm 3.5 cái, bằng cách giới hạn width của rightColumn
          >
            {items.map((m, i) => {
              const mDetail = movieDetails[m.slug] || m;
              // Thumbnail strip cũng tuân theo quy tắc ưu tiên poster_url -> thumb_url
              const thumbUrl = imgUrl(mDetail.poster_url || mDetail.thumb_url || m.thumb_url);
              return (
                <TouchableHighlightTV
                  key={m._id || i}
                  ref={(el: any) => { thumbRefs.current[i] = el; }}
                  onFocus={() => {
                    setFocusedThumb(i);
                    setActiveIdx(i);
                    interact();
                    onFocusBanner?.();
                  }}
                  onBlur={() => setFocusedThumb(null)}
                  onPress={() => { }}
                  style={[
                    styles.thumbWrap,
                    i === activeIdx && styles.thumbActive,
                    focusedThumb === i && styles.thumbWrapFocused
                  ]}
                  underlayColor="transparent"
                  activeOpacity={1}
                  nextFocusUp={nextFocusUpNode?.current ? findNodeHandle(nextFocusUpNode.current) : undefined}
                  nextFocusDown={getPlayBtnNode()}
                  nextFocusLeft={findNodeHandle(thumbRefs.current[i === 0 ? items.length - 1 : i - 1])}
                  nextFocusRight={findNodeHandle(thumbRefs.current[i === items.length - 1 ? 0 : i + 1])}
                >
                  <Image
                    source={{ uri: thumbUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </TouchableHighlightTV>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
