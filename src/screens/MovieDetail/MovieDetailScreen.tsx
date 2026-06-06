import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableHighlight, FlatList, ActivityIndicator, Modal, TVFocusGuideView, findNodeHandle, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getMovieDetail, imgUrl, getMoviePeoples, getMovieImages, parseItems, getByCategory, getByCountry, searchMovies, getMovieKeywords } from '../../services/ophimApi';
import { styles } from './MovieDetailScreen.styles';
import { useTVNavigation } from '../../context/NavigationContext';
import { MovieRow } from '../../components/MovieRow/MovieRow';
import { MovieDetailTabs } from '../../components/MovieDetail/MovieDetailTabs/MovieDetailTabs';
import { MovieDetailInfo } from '../../components/MovieDetail/MovieDetailInfo/MovieDetailInfo';
import { MovieDetailCast } from '../../components/MovieDetail/MovieDetailCast/MovieDetailCast';
import { MovieDetailGallery } from '../../components/MovieDetail/MovieDetailGallery/MovieDetailGallery';
import { MovieDetailTrailer } from '../../components/MovieDetail/MovieDetailTrailer/MovieDetailTrailer';
import { EpisodeSelectionUI } from '../../components/MovieDetail/EpisodeSelectionUI/EpisodeSelectionUI';

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim();

export const MovieDetailScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { slug } = route.params || {};
  const { activeSidebarNodeRef, heroBannerFocusNodeRef } = useTVNavigation();

  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [catRelated, setCatRelated] = useState<any[]>([]);
  const [countryRelated, setCountryRelated] = useState<any[]>([]);
  const [kwRelated, setKwRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedBtn, setFocusedBtn] = useState<string | null>(null);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showDescModal, setShowDescModal] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [activeTabNodeHandle, setActiveTabNodeHandle] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const playBtnRef = useRef<any>(null);
  const tabsContainerRef = useRef<any>(null);
  const activeTabRef = useRef<any>(null);
  const episodesBtnRef = useRef<any>(null);
  const saveBtnRef = useRef<any>(null);
  const lastFocusedMainBtnRef = useRef<any>(null);
  const relatedYRef = useRef<number>(1000);
  const rowYPositionsRef = useRef<Record<string, number>>({});
  const isComingFromBottomRef = useRef(false);
  const isInMovieRowRef = useRef(false);
  const isTrailerPlayingRef = useRef(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getMovieDetail(slug)
      .then(r => {
        const item = r?.data?.item;
        if (item) {
          setMovie(item);

          // Phim liên quan theo keyword
          getMovieKeywords(slug)
            .then(kwRes => {
              const keywords = kwRes?.data?.keywords ?? [];
              if (keywords.length) {
                const terms = keywords
                  .filter((k: any) => k.name_vn && k.name_vn.length > 3)
                  .slice(0, 3)
                  .map((k: any) => k.name_vn || k.name);

                Promise.all(
                  terms.map((kw: string) => searchMovies(kw, 1, 10).then(parseItems).catch(() => []))
                ).then(results => {
                  const seen = new Set([slug]);
                  const merged = results.flat().filter(m => {
                    if (seen.has(m.slug)) return false;
                    seen.add(m.slug);
                    return true;
                  });
                  setKwRelated(merged.slice(0, 18));
                });
              }
            }).catch(() => { });

          // Phim cùng thể loại
          const cat = item.category?.[0]?.slug;
          if (cat) {
            getByCategory(cat, { page: 1, limit: 16 })
              .then(r2 => setCatRelated(parseItems(r2).filter((m: any) => m.slug !== slug)))
              .catch(() => { });
          }

          // Phim cùng quốc gia
          const country = item.country?.[0]?.slug;
          if (country) {
            getByCountry(country, { page: 1, limit: 16 })
              .then(rC => setCountryRelated(parseItems(rC).filter((m: any) => m.slug !== slug)))
              .catch(() => { });
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  // Chỉ load diễn viên khi chọn tab Diễn viên
  useEffect(() => {
    if (activeTab === 'cast' && cast.length === 0) {
      getMoviePeoples(slug)
        .then(r => {
          if (r?.success && r?.data?.peoples) {
            setCast(r.data.peoples);
          }
        })
        .catch(console.error);
    }
  }, [activeTab, slug]);

  // Chỉ load ảnh khi chọn tab Ảnh
  useEffect(() => {
    if (activeTab === 'gallery' && images.length === 0 && movie) {
      const urls = [];
      if (movie.thumb_url) urls.push(imgUrl(movie.thumb_url));
      if (movie.poster_url) urls.push(imgUrl(movie.poster_url));
      setImages(urls);
    }
  }, [activeTab, movie]);

  // Node handle is now set instantly by MovieDetailTabs via onActiveTabNodeHandle
  useEffect(() => {
    if (movie && playBtnRef.current && heroBannerFocusNodeRef) {
      heroBannerFocusNodeRef.current = playBtnRef.current;
    }
  }, [movie, heroBannerFocusNodeRef]);
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  if (!movie) return null;

  const backdrop = imgUrl(movie.poster_url || movie.thumb_url);
  const rawDesc = stripHtml(movie.content || movie.description);
  const shortDesc = rawDesc.length > 300 ? rawDesc.slice(0, 300) + '...' : rawDesc;

  // Xử lý danh sách tập
  const firstServer = movie.episodes?.[0];
  const episodes = firstServer?.server_data || [];

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>

        {/* HERO SECTION */}
        <TVFocusGuideView autoFocus style={styles.heroSection}>
          <Image
            source={{ uri: backdrop }}
            style={styles.heroBg}
            resizeMode="cover"
          />
          {/* Gradient Overlay for TV */}
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(20,20,20,0.6)' }]} />

          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle} numberOfLines={2}>{movie.name}</Text>

              <View style={styles.metaRow}>
                {movie.quality && <Text style={styles.metaText}>{movie.quality}</Text>}
                {movie.year && <Text style={styles.metaText}>{movie.year}</Text>}
                {movie.time && <Text style={styles.metaText}>{movie.time}</Text>}
                {movie.lang && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{movie.lang}</Text>
                  </View>
                )}
                {movie.episode_current && (
                  <View style={[styles.badge, { borderColor: '#46d369' }]}>
                    <Text style={[styles.badgeText, { color: '#46d369' }]}>{movie.episode_current}</Text>
                  </View>
                )}
              </View>
              <TouchableHighlight
                onFocus={() => setFocusedBtn('desc')}
                onBlur={() => setFocusedBtn(null)}
                onPress={() => setShowDescModal(true)}
                nextFocusUp={activeSidebarNodeRef?.current ? findNodeHandle(activeSidebarNodeRef.current) : undefined}
                nextFocusDown={lastFocusedMainBtnRef.current ? findNodeHandle(lastFocusedMainBtnRef.current) : (playBtnRef.current ? findNodeHandle(playBtnRef.current) : undefined)}
                underlayColor="transparent"
                style={{
                  padding: 4,
                  marginLeft: -4,
                  marginBottom: 16,
                  borderRadius: 4,
                  backgroundColor: focusedBtn === 'desc' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderWidth: focusedBtn === 'desc' ? 2 : 0,
                  borderColor: focusedBtn === 'desc' ? '#fff' : 'transparent'
                }}
              >
                <Text style={styles.descText}>{shortDesc}</Text>
              </TouchableHighlight>

              <View style={styles.actionRow}>
                {/* Nút XEM PHIM */}
                <TouchableHighlight
                  ref={playBtnRef}
                  hasTVPreferredFocus
                  nextFocusDown={activeTabRef.current ? findNodeHandle(activeTabRef.current) : undefined}
                  nextFocusLeft={saveBtnRef.current ? findNodeHandle(saveBtnRef.current) : undefined}
                  nextFocusRight={episodes.length > 0 && episodesBtnRef.current ? findNodeHandle(episodesBtnRef.current) : (saveBtnRef.current ? findNodeHandle(saveBtnRef.current) : undefined)}
                  onFocus={() => {
                    isComingFromBottomRef.current = false;
                    setFocusedBtn('play');
                    lastFocusedMainBtnRef.current = playBtnRef.current;
                    if (heroBannerFocusNodeRef) heroBannerFocusNodeRef.current = playBtnRef.current;
                    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                  }}
                  onBlur={() => setFocusedBtn(null)}
                  onPress={() => { /* Navigate to WatchScreen */ }}
                  style={[styles.btn, styles.btnPrimary, focusedBtn === 'play' && styles.btnPrimaryFocused]}
                  underlayColor="#E50914"
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/play--v1.png' }} style={{ width: 24, height: 24 }} />
                    <Text style={styles.btnTextPrimary}>PHÁT</Text>
                  </View>
                </TouchableHighlight>

                {/* Nút CHỌN TẬP */}
                {episodes.length > 0 && (
                  <TouchableHighlight
                    ref={episodesBtnRef}
                    nextFocusDown={activeTabRef.current ? findNodeHandle(activeTabRef.current) : undefined}
                    nextFocusLeft={playBtnRef.current ? findNodeHandle(playBtnRef.current) : undefined}
                    nextFocusRight={saveBtnRef.current ? findNodeHandle(saveBtnRef.current) : undefined}
                    onFocus={() => {
                      isComingFromBottomRef.current = false;
                      setFocusedBtn('episodes');
                      lastFocusedMainBtnRef.current = episodesBtnRef.current;
                      if (heroBannerFocusNodeRef) heroBannerFocusNodeRef.current = episodesBtnRef.current;
                      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                    }}
                    onBlur={() => setFocusedBtn(null)}
                    onPress={() => setShowEpisodes(true)}
                    style={[styles.btn, focusedBtn === 'episodes' && styles.btnFocused]}
                    underlayColor="rgba(90, 90, 90, 0.95)"
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/list.png' }} style={{ width: 24, height: 24 }} />
                      <Text style={styles.btnText}>CHỌN TẬP</Text>
                    </View>
                  </TouchableHighlight>
                )}

                {/* Nút LƯU PHIM */}
                <TouchableHighlight
                  ref={saveBtnRef}
                  nextFocusDown={activeTabRef.current ? findNodeHandle(activeTabRef.current) : undefined}
                  nextFocusLeft={episodes.length > 0 && episodesBtnRef.current ? findNodeHandle(episodesBtnRef.current) : (playBtnRef.current ? findNodeHandle(playBtnRef.current) : undefined)}
                  nextFocusRight={playBtnRef.current ? findNodeHandle(playBtnRef.current) : undefined}
                  onFocus={() => {
                    isComingFromBottomRef.current = false;
                    setFocusedBtn('save');
                    lastFocusedMainBtnRef.current = saveBtnRef.current;
                    if (heroBannerFocusNodeRef) heroBannerFocusNodeRef.current = saveBtnRef.current;
                    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                  }}
                  onBlur={() => setFocusedBtn(null)}
                  onPress={() => { }}
                  style={[styles.btn, focusedBtn === 'save' && styles.btnFocused]}
                  underlayColor="rgba(90, 90, 90, 0.95)"
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/bookmark-ribbon.png' }} style={{ width: 24, height: 24 }} />
                    <Text style={styles.btnText}>LƯU PHIM</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>

          {/* Khoảng trống phía trên Tab đã bị xóa vì Tab dùng absolute */}

          {/* TABS (BÊN TRONG HERO SECTION ĐỂ ĐƯỢC CHÈN LÊN ẢNH NỀN) */}
          <TVFocusGuideView ref={tabsContainerRef} autoFocus style={{ position: 'absolute', bottom: 10, width: '100%', alignItems: 'center' }}>
            <MovieDetailTabs
              nextFocusUpNode={playBtnRef.current ? findNodeHandle(playBtnRef.current) : null}
              tabs={[
                { id: 'info', label: 'TỔNG QUAN' },
                { id: 'cast', label: 'DIỄN VIÊN' },
                { id: 'trailer', label: 'TRAILER' },
                { id: 'gallery', label: 'ẢNH' }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeTabRef={activeTabRef}
              onActiveTabNodeHandle={(handle) => {
                if (handle !== activeTabNodeHandle) {
                  setActiveTabNodeHandle(handle);
                }
              }}
              onTabFocus={() => {
                const cameFromRow = isInMovieRowRef.current;
                isInMovieRowRef.current = false;
                if (cameFromRow || !isComingFromBottomRef.current) {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({ y: Dimensions.get('window').height * 0.78, animated: true });
                  }, 150);
                } else if (activeTab === 'trailer' && isTrailerPlayingRef.current) {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollTo({ y: Dimensions.get('window').height * 0.78, animated: true });
                  }, 150);
                }
              }}
            />
          </TVFocusGuideView>
        </TVFocusGuideView>

        {/* NỘI DUNG TABS */}
        <TVFocusGuideView style={{ width: '100%', alignItems: 'center', paddingTop: 10 }}>
          <View style={{ width: '100%' }}>
            {activeTab === 'info' && (
              <View style={{ width: '100%', paddingBottom: 20 }}>
                <MovieDetailInfo movie={movie} />
              </View>
            )}

            {activeTab === 'cast' && (
              <View style={{ width: '100%', paddingBottom: 20 }}>
                <MovieDetailCast cast={cast} />
              </View>
            )}

            {activeTab === 'trailer' && (
              <MovieDetailTrailer
                trailerUrl={movie.trailer_url}
                nextFocusUpNode={activeTabNodeHandle || undefined}
                onPlay={() => {
                  isTrailerPlayingRef.current = true;
                  setTimeout(() => scrollViewRef.current?.scrollTo({ y: Dimensions.get('window').height * 0.92, animated: true }), 250);
                }}
                onExitVideo={() => {
                  isTrailerPlayingRef.current = false;
                  scrollViewRef.current?.scrollTo({ y: Dimensions.get('window').height * 0.78, animated: true });
                }}
                onFocusContent={() => {
                  if (isInMovieRowRef.current || isTrailerPlayingRef.current) {
                    setTimeout(() => {
                      const targetY = isTrailerPlayingRef.current 
                        ? Dimensions.get('window').height * 0.92 
                        : Dimensions.get('window').height * 0.78;
                      scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
                    }, 150);
                    isInMovieRowRef.current = false;
                  }
                  isComingFromBottomRef.current = true;
                }}
              />
            )}

            {activeTab === 'gallery' && (
              <MovieDetailGallery
                images={images}
                nextFocusUpNode={activeTabNodeHandle || undefined}
                onImagePress={(uri: string) => setLightboxImage(uri)}
                onFocusContent={() => {
                  if (isInMovieRowRef.current) {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({ y: Dimensions.get('window').height * 0.78, animated: true });
                    }, 150);
                    isInMovieRowRef.current = false;
                  }
                  isComingFromBottomRef.current = true;
                }}
              />
            )}
          </View>
        </TVFocusGuideView>
        {/* CÁC DANH SÁCH PHIM LIÊN QUAN GIỐNG NETFLIX */}
        <View
          style={{ marginTop: 40, paddingBottom: 60 }}
          onLayout={(e) => relatedYRef.current = e.nativeEvent.layout.y}
        >
          {(() => {
            const needsExplicitFocusUp =
              activeTab === 'info' ||
              activeTab === 'cast' ||
              (activeTab === 'trailer' && !movie?.trailer_url) ||
              (activeTab === 'gallery' && (!images || images.length === 0));
            const focusUpNode = needsExplicitFocusUp ? activeTabNodeHandle : undefined;

            return (
              <>
                {kwRelated.length > 0 && (
                  <MovieRow
                    title="Phim liên quan"
                    items={kwRelated}
                    nextFocusUpNode={focusUpNode}
                    onLayout={(e) => rowYPositionsRef.current['kw'] = e.nativeEvent.layout.y}
                    onFocusRow={() => {
                      isInMovieRowRef.current = true;
                    }}
                  />
                )}

                {catRelated.length > 0 && movie?.category?.[0]?.name && (
                  <MovieRow
                    title={`Cùng thể loại · ${movie.category[0].name}`}
                    items={catRelated}
                    nextFocusUpNode={kwRelated.length > 0 ? undefined : focusUpNode}
                    onLayout={(e) => rowYPositionsRef.current['cat'] = e.nativeEvent.layout.y}
                    onFocusRow={() => {
                      isInMovieRowRef.current = true;
                      setTimeout(() => {
                        scrollViewRef.current?.scrollTo({ y: Math.max(0, relatedYRef.current + (rowYPositionsRef.current['cat'] || 0) - 80), animated: true });
                      }, 100);
                    }}
                  />
                )}

                {countryRelated.length > 0 && movie?.country?.[0]?.name && (
                  <MovieRow
                    title={`Cùng quốc gia · ${movie.country[0].name}`}
                    items={countryRelated}
                    nextFocusUpNode={(kwRelated.length > 0 || catRelated.length > 0) ? undefined : focusUpNode}
                    onLayout={(e) => rowYPositionsRef.current['country'] = e.nativeEvent.layout.y}
                    onFocusRow={() => {
                      isInMovieRowRef.current = true;
                      setTimeout(() => {
                        scrollViewRef.current?.scrollTo({ y: Math.max(0, relatedYRef.current + (rowYPositionsRef.current['country'] || 0) - 80), animated: true });
                      }, 100);
                    }}
                  />
                )}
              </>
            );
          })()}
        </View>

      </ScrollView>

      {/* MODAL CHI TIẾT NỘI DUNG */}
      <Modal visible={showDescModal} transparent animationType="fade">
        <View style={styles.epBoxOverlay}>
          <TVFocusGuideView autoFocus style={[styles.epBox, { width: 800, height: 'auto', padding: 40 }]}>
            <Text style={styles.epBoxTitle}>Tóm tắt nội dung</Text>
            <ScrollView style={{ maxHeight: 500 }}>
              <Text style={{ color: '#fff', fontSize: 22, lineHeight: 34 }}>{rawDesc}</Text>
            </ScrollView>
            <TouchableHighlight
              hasTVPreferredFocus
              onPress={() => setShowDescModal(false)}
              style={[styles.btn, styles.btnPrimary, { alignSelf: 'center', marginTop: 30 }]}
              underlayColor="#e50914"
            >
              <Text style={styles.btnTextPrimary}>ĐÓNG</Text>
            </TouchableHighlight>
          </TVFocusGuideView>
        </View>
      </Modal>

      {/* MODAL CHỌN TẬP MỚI (NETFLIX STYLE) */}
      <Modal visible={showEpisodes} transparent animationType="fade" onRequestClose={() => setShowEpisodes(false)}>
        <View style={[styles.epBoxOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
          <TVFocusGuideView autoFocus style={[styles.epBox, { width: '85%', height: '85%', padding: 30 }]}>
            <EpisodeSelectionUI
              servers={movie.episodes || []}
              playingEpisodeSlug={undefined}
              onPlayEpisode={(ep, serverName) => {
                setShowEpisodes(false);
                console.log('Play', ep.slug, 'from', serverName);
              }}
              onPlayMain={() => {
                setShowEpisodes(false);
                console.log('Play Main');
              }}
              onClose={() => setShowEpisodes(false)}
            />
          </TVFocusGuideView>
        </View>
      </Modal>

      {/* LIGHTBOX ẢNH */}
      <Modal visible={!!lightboxImage} transparent animationType="fade" onRequestClose={() => setLightboxImage(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
          <TVFocusGuideView autoFocus style={{ width: '90%', height: '90%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: lightboxImage || '' }} style={{ width: '100%', height: '80%' }} resizeMode="contain" />
            <TouchableHighlight
              hasTVPreferredFocus
              style={{ marginTop: 20, paddingHorizontal: 40, paddingVertical: 15, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4 }}
              onPress={() => setLightboxImage(null)}
              underlayColor="#E50914"
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>ĐÓNG</Text>
            </TouchableHighlight>
          </TVFocusGuideView>
        </View>
      </Modal>
    </View>
  );
};

