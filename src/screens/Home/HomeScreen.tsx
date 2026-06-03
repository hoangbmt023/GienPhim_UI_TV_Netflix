import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { HeroBanner } from '../../components/HeroBanner/HeroBanner';
import { useTVNavigation } from '../../context/NavigationContext';
import { MovieRow } from '../../components/MovieRow/MovieRow';
import { SpotlightSection } from '../../components/SpotlightSection/SpotlightSection';
import { styles } from './HomeScreen.styles';
import {
  getHome,
  getMovieList,
  parseItems,
} from '../../services/ophimApi';

export const HomeScreen = () => {
  const { height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const { activeSidebarNodeRef } = useTVNavigation();
  const firstSpotlightNodeRef = useRef<any>(null);

  const [heroMovies, setHeroMovies] = useState([]);
  const [seriesMovies, setSeriesMovies] = useState([]);
  const [singleMovies, setSingleMovies] = useState([]);
  const [theaterMovies, setTheaterMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [dubbedMovies, setDubbedMovies] = useState([]);
  const [vietsubMovies, setVietsubMovies] = useState([]);

  const [loading, setLoading] = useState({
    hero: true,
    series: true,
    single: true,
    theater: true,
    upcoming: true,
    dubbed: true,
    vietsub: true,
  });

  const done = (key: string) => setLoading((p) => ({ ...p, [key]: false }));

  useEffect(() => {
    getHome()
      .then((r) => setHeroMovies(parseItems(r).filter((m: any) => m.thumb_url)))
      .catch(console.error)
      .finally(() => done('hero'));

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
  }, []);

  const handleScrollToTop = () => {
    // Only scroll if the scrollview is scrolled down (y > 10) to prevent jittery scrolling when already at top
    if (scrollYRef.current > 10) {
      console.log(`[HomeScreen] Scrolling to top. Current Y: ${scrollYRef.current}`);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleFocusSpotlight = () => {
    // Sử dụng setTimeout để đè lên lệnh cuộn mặc định của Android TV
    // Cuộn chính xác xuống y = height để giấu hoàn toàn HeroBanner
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: height, animated: true });
      }, 100);
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
          <HeroBanner
            movies={heroMovies}
            loading={loading.hero}
            containerHeight={height}
            onFocusBanner={handleScrollToTop}
            nextFocusUpNode={activeSidebarNodeRef}
            nextFocusDownNode={firstSpotlightNodeRef}
          />

          <SpotlightSection 
            title="Phim chiếu rạp mới nhất" 
            items={theaterMovies} 
            loading={loading.theater} 
            firstItemRef={firstSpotlightNodeRef}
            onFocusRow={handleFocusSpotlight}
          />
          {/* <MovieRow title="Phim sắp chiếu" items={upcomingMovies} loading={loading.upcoming} />
          <MovieRow title="Top Phim Bộ" items={seriesMovies} loading={loading.series} />
          <MovieRow title="Top Phim Lẻ" items={singleMovies} loading={loading.single} />
          <MovieRow title="Tuyển tập Vietsub" items={vietsubMovies} loading={loading.vietsub} />
          <MovieRow title="Phim Lồng tiếng" items={dubbedMovies} loading={loading.dubbed} /> */}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
};
