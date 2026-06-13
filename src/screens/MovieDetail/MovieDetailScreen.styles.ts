import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    height: height, // Đúng bằng 1 màn hình
    width: '100%',
    flexDirection: 'column',
  },
  heroContent: {
    flexDirection: 'row',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroLeft: {
    flex: 1,
    paddingLeft: 80,
    paddingRight: 40,
    paddingTop: 76, // Đẩy info xuống một chút
    zIndex: 10,
    justifyContent: 'flex-start',
    width: '100%',
  },
  heroTitle: {
    fontSize: 54,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 16,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descText: {
    color: '#ccc',
    fontSize: 18,
    lineHeight: 28,
    width: '100%', // Mở rộng hết cỡ theo heroLeft
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 16,
    backgroundColor: 'rgba(90, 90, 90, 0.95)',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  btnPrimary: {
    backgroundColor: '#E50914',
  },
  btnFocused: {
    transform: [{ scale: 1.08 }],
    borderColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnPrimaryFocused: {
    transform: [{ scale: 1.08 }],
    borderColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  btnTextPrimary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  btnTextFocused: {
    color: '#fff',
  },
  infoSection: {
    paddingLeft: 80,
    paddingRight: 80,
    marginTop: 40, // Xích xuống xíu để không chạm banner
    zIndex: 10,
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#777',
    fontSize: 16,
    width: 120,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  // Box chọn tập
  epBoxOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  epBox: {
    width: 500,
    height: 600,
    backgroundColor: '#141414',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  epBoxTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  epBtn: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  epBtnFocused: {
    backgroundColor: '#e50914',
  },
  epBtnText: {
    color: '#ccc',
    fontSize: 18,
  },
  epBtnTextFocused: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
