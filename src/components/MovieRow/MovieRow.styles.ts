import { StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 60, // Large gap between rows
  },
  rowTitle: {
    fontSize: 24, // Netflix TV title size
    color: theme.colors.text,
    fontWeight: 'bold',
    marginLeft: 80, // Netflix TV side padding
    marginBottom: 16,
  },
  row: {
    paddingLeft: 80, // Row offset matching the title
  },
  card: {
    width: 260,
    height: 146,
    marginRight: 10,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'visible',
    backgroundColor: 'transparent', // Không để góc đen khi focus
  },
  skeletonCard: {
    width: 260,
    height: 146,
    marginRight: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardFocused: {
    borderColor: theme.colors.text,
  },
  cardInner: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 3,   // nhỏ hơn card một chút để nằm gọn trong viền
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  topNumberWrapper: {
    position: 'absolute',
    bottom: -30,  // Lùi xuống 1/4 số dưới đáy card
    left: 0,
    zIndex: 3,
  },
  topNumberStroke: {
    position: 'absolute',
    bottom: 0,
    fontSize: 130,
    lineHeight: 120,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.9)', // Viền trắng mỏ nhẹ hơn
  },
  topNumberStrokeFocused: {
    color: 'rgba(229,9,20,0.85)', // Viền đỏ khi focus
  },
  topNumber: {
    position: 'absolute',
    bottom: 0,
    fontSize: 130,
    lineHeight: 120,
    fontWeight: '900',
    color: 'transparent', // Ruột số trong suốt
    zIndex: 4,
  },
  topNumberFocused: {
    // không thay đổi color vì đã transparent
  },
  badgeHD: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e50914',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  badgeHDText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeEp: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1a7f37', // Xanh lá
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  badgeEpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
