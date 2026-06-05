import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, useWindowDimensions, TVFocusGuideView } from 'react-native';
import { HeroBanner } from '../../components/HeroBanner/HeroBanner';
import { useTVNavigation } from '../../context/NavigationContext';
import { MovieRow } from '../../components/MovieRow/MovieRow';
import { SpotlightSection } from '../../components/SpotlightSection/SpotlightSection';
import { styles } from './HomeScreen.styles';
import {
  getHome,
  getMovieList,
  getByCountry,
  parseItems,
} from '../../services/ophimApi';

export const HomeScreen = () => {
  const { height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const { activeSidebarNodeRef, heroBannerFocusNodeRef } = useTVNavigation();

  const [heroMovies, setHeroMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [seriesMovies, setSeriesMovies] = useState([]);
  const [singleMovies, setSingleMovies] = useState([]);
  const [theaterMovies, setTheaterMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [dubbedMovies, setDubbedMovies] = useState([]);
  const [vietsubMovies, setVietsubMovies] = useState([]);
  const [koreanMovies, setKoreanMovies] = useState([]);
  const [chineseMovies, setChineseMovies] = useState([]);
  const [westernMovies, setWesternMovies] = useState([]);
  const [japanMovies, setJapanMovies] = useState([]);
  const [vietnamMovies, setVietnamMovies] = useState([]);

  const [loading, setLoading] = useState({
    hero: true,
    new: true,
    series: true,
    single: true,
    theater: true,
    upcoming: true,
    dubbed: true,
    vietsub: true,
    korean: true,
    chinese: true,
    western: true,
    japan: true,
    vietnam: true,
  });

  const done = (key: string) => setLoading((p) => ({ ...p, [key]: false }));

  useEffect(() => {
    getHome()
      .then((r) => setHeroMovies(parseItems(r).filter((m: any) => m.thumb_url)))
      .catch(console.error)
      .finally(() => done('hero'));

    getMovieList('phim-moi', { page: 1 })
      .then((r) => setNewMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('new'));

    getMovieList('phim-bo', { page: 1 })
      .then((r) => setSeriesMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('series'));

    getMovieList('phim-le', { page: 1 })
      .then((r) => setSingleMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('single'));

    getMovieList('phim-chieu-rap', { page: 1 })
      .then((r) => setTheaterMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('theater'));

    getMovieList('phim-sap-chieu', { page: 1 })
      .then((r) => setUpcomingMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('upcoming'));

    getMovieList('phim-long-tieng', { page: 1 })
      .then((r) => setDubbedMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('dubbed'));

    getMovieList('phim-vietsub', { page: 1 })
      .then((r) => setVietsubMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('vietsub'));

    getByCountry('han-quoc', { page: 1 })
      .then((r) => setKoreanMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('korean'));

    getByCountry('trung-quoc', { page: 1 })
      .then((r) => setChineseMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('chinese'));

    getByCountry('au-my', { page: 1 })
      .then((r) => setWesternMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('western'));

    getByCountry('nhat-ban', { page: 1 })
      .then((r) => setJapanMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('japan'));

    getByCountry('viet-nam', { page: 1 })
      .then((r) => setVietnamMovies(parseItems(r)))
      .catch(console.error)
      .finally(() => done('vietnam'));
  }, []);

  const handleScrollToTop = () => {
    // Dùng setTimeout để đè lên lệnh cuộn mặc định của Android TV
    if (scrollYRef.current > 10) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 50);
    }
  };

  const rowYPositions = useRef<Record<string, number>>({});

  const handleFocusRow = (rowKey: string) => {
    // Sử dụng setTimeout để đè lên lệnh cuộn mặc định của Android TV
    if (scrollViewRef.current && rowYPositions.current[rowKey] !== undefined) {
      setTimeout(() => {
        // Spotlight có paddingTop: 40, ta trừ thêm offset 40 để cách mép trên tổng cộng 80px (giống MovieRow)
        const offset = rowKey === 'spotlight' ? 30 : 80;
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, rowYPositions.current[rowKey] - offset),
          animated: true
        });
      }, 50);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            scrollYRef.current = event.nativeEvent.contentOffset.y;
          }}
        >
          <TVFocusGuideView autoFocus style={{ flex: 1 }}>
            <HeroBanner
              movies={heroMovies}
              loading={loading.hero}
              containerHeight={height}
              onFocusBanner={handleScrollToTop}
              nextFocusUpNode={activeSidebarNodeRef}
            />
          </TVFocusGuideView>

          <SpotlightSection
            title="Phim chiếu rạp mới nhất"
            items={theaterMovies}
            loading={loading.theater}
            nextFocusUpNode={heroBannerFocusNodeRef}
            onLayout={(e) => rowYPositions.current['spotlight'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('spotlight')}
          />
          <MovieRow
            title="Phim sắp chiếu"
            items={upcomingMovies}
            loading={loading.upcoming}
            onLayout={(e) => rowYPositions.current['upcoming'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('upcoming')}
          />
          <MovieRow
            title="Top Phim Bộ"
            items={seriesMovies}
            loading={loading.series}
            onLayout={(e) => rowYPositions.current['series'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('series')}
            isTop10={true}
          />
          <MovieRow
            title="Top Phim Lẻ"
            items={singleMovies}
            loading={loading.single}
            onLayout={(e) => rowYPositions.current['single'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('single')}
            isTop10={true}
          />
          <MovieRow
            title="Tuyển tập Vietsub"
            items={vietsubMovies}
            loading={loading.vietsub}
            onLayout={(e) => rowYPositions.current['vietsub'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('vietsub')}
          />
          <MovieRow
            title="Phim Lồng tiếng"
            items={dubbedMovies}
            loading={loading.dubbed}
            onLayout={(e) => rowYPositions.current['dubbed'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('dubbed')}
          />
          <MovieRow
            title="Phim Hàn Quốc"
            items={koreanMovies}
            loading={loading.korean}
            onLayout={(e) => rowYPositions.current['korean'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('korean')}
          />
          <MovieRow
            title="Phim Trung Quốc"
            items={chineseMovies}
            loading={loading.chinese}
            onLayout={(e) => rowYPositions.current['chinese'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('chinese')}
          />
          <MovieRow
            title="Phim Âu Mỹ"
            items={westernMovies}
            loading={loading.western}
            onLayout={(e) => rowYPositions.current['western'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('western')}
          />
          <MovieRow
            title="Phim Nhật Bản"
            items={japanMovies}
            loading={loading.japan}
            onLayout={(e) => rowYPositions.current['japan'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('japan')}
          />
          <MovieRow
            title="Phim Việt Nam"
            items={vietnamMovies}
            loading={loading.vietnam}
            onLayout={(e) => rowYPositions.current['vietnam'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('vietnam')}
          />
          <MovieRow
            title="Phim Mới Cập Nhật"
            items={newMovies}
            loading={loading.new}
            onLayout={(e) => rowYPositions.current['new'] = e.nativeEvent.layout.y}
            onFocusRow={() => handleFocusRow('new')}
          />

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
};
