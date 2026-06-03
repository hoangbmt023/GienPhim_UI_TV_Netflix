import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../constants/theme';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  heroBanner: {
    height: height,
    width: '100%',
    marginBottom: theme.spacing.xl,
    backgroundColor: '#111',
    justifyContent: 'center',
    position: 'relative',
  },
  backdropImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 15, 15, 0.65)', // Soft cinematic overlay for high contrast text readability
    zIndex: 2,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 80, // Netflix TV horizontal padding
    width: '100%',
    flex: 1,
    zIndex: 10,
    paddingTop: 40, // Reduced offset for better vertical centering
  },
  leftColumn: {
    width: '58%',
    justifyContent: 'center',
    zIndex: 15,
  },
  rightColumn: {
    width: '38%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 15,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  badge: {
    borderWidth: 1,
    borderColor: '#aaa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeHD: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  badgeSub: {
    borderColor: '#4caf50',
  },
  badgeSubText: {
    color: '#4caf50',
  },
  badgeEp: {
    backgroundColor: 'rgba(70, 211, 105, 0.18)',
    borderColor: 'rgba(70, 211, 105, 0.55)',
  },
  badgeEpText: {
    color: '#46d369',
  },
  heroTitle: {
    fontSize: 52, // Netflix TV title size
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    lineHeight: 60,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.85)', // Trắng nhưng nhạt hơn tiêu đề một chút
    fontSize: 18,
    fontWeight: 'bold', // Đậm giống IMDB để dễ nhìn hơn
    marginRight: 16,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  heroDesc: {
    color: '#e5e5e5', // Light gray for readability
    fontSize: 18,
    lineHeight: 28,
    minHeight: 84, // Cố định chiều cao 3 dòng để không bị giật layout khi load
    maxWidth: '95%',
    marginBottom: theme.spacing.m,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.m,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginRight: theme.spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  buttonFocused: {
    transform: [{ scale: 1.08 }],
    borderColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonPrimary: {
    backgroundColor: '#E50914',
  },
  buttonTextPrimary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(90, 90, 90, 0.95)', // Bớt trong suốt, gần như xám đặc
  },
  buttonTextSecondary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thumbsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 140, // Đẩy cụm ảnh nhỏ xuống tầm 3/4 màn hình
  },
  thumbWrap: {
    width: 76,
    height: 114,
    marginHorizontal: 4,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
    opacity: 0.6,
  },
  thumbWrapFocused: {
    borderColor: '#fff',
    opacity: 1,
    transform: [{ scale: 1.12 }],
  },
  thumbActive: {
    borderColor: theme.colors.primary,
    opacity: 1,
  },
  skeletonBox: {
    backgroundColor: '#333',
    borderColor: '#333',
    borderRadius: 4,
  },
  skeletonBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
  },
  skeletonBadge1: { width: 40, height: 26 },
  skeletonBadge2: { width: 70, height: 26, marginLeft: 8 },
  skeletonBadge3: { width: 50, height: 26, marginLeft: 8 },
  skeletonTitle1: { width: '80%', height: 50, borderRadius: 8, marginBottom: 12 },
  skeletonTitle2: { width: '50%', height: 50, borderRadius: 8, marginBottom: 24 },
  skeletonMeta1: { width: 70, height: 20, marginRight: 16 },
  skeletonMeta2: { width: 120, height: 20, marginRight: 16 },
  skeletonMeta3: { width: 90, height: 20 },
  skeletonDesc1: { width: '95%', height: 20, marginBottom: 8 },
  skeletonDesc2: { width: '85%', height: 20, marginBottom: 8 },
  skeletonDesc3: { width: '60%', height: 20, marginBottom: 24 },
  skeletonBtn1: { width: 130, height: 48, borderColor: 'transparent' },
  skeletonBtn2: { width: 150, height: 48, borderColor: 'transparent' },
});
