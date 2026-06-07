import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  
  // Banner
  bannerContainer: {
    width: '100%',
    height: '35%', // Cố định chiều cao, không co giãn
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.8,
  },
  bannerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    backgroundColor: 'rgba(5,5,5,0.4)', 
  },
  bannerBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    backgroundColor: 'rgba(5,5,5,0.8)',
  },
  bannerContent: {
    paddingBottom: 20,
    paddingLeft: 50,
    paddingRight: 50,
    zIndex: 2,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeInfo: {
    color: '#ddd',
    fontSize: 20,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  episodeCountBadge: {
    marginLeft: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  episodeCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Main Content
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20, // Tràn ra 2 mép màn hình
    paddingTop: 10,
  },
  
  // Selectors
  selectorRow: {
    flexDirection: 'row',
    marginBottom: 5, // Đẩy grid lên sát selector hơn
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  selectorBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectorBtnFocused: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
  selectorBtnSelected: {
    backgroundColor: '#fff',
  },
  selectorBtnSelectedFocused: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
  selectorText: {
    color: '#ccc',
    fontSize: 20,
    fontWeight: '600',
  },
  selectorTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectorTextFocused: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 100,
    paddingTop: 0, // Bỏ hẳn margin top theo yêu cầu
    paddingHorizontal: 15,
  },
  epBoxWrapper: {
    width: '18%', 
    marginHorizontal: '1%',
    marginBottom: 5,
    height: 120, // Khung vô hình to hơn để hứng scroll
    justifyContent: 'center',
    alignItems: 'center',
  },
  epBox: {
    width: '100%',
    height: 100, 
    backgroundColor: 'rgba(30,30,30,0.9)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  epBoxFocused: {
    backgroundColor: 'rgba(50,50,50,1)',
    borderColor: '#e50914', // Thin Netflix red border
    transform: [{ scale: 1.08 }],
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    zIndex: 10,
  },
  epBoxPlaying: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    borderColor: 'rgba(229, 9, 20, 0.5)',
  },
  epNumberText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  playingText: {
    color: '#e50914',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  checkIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    opacity: 0.8,
    tintColor: '#fff',
  }
});
