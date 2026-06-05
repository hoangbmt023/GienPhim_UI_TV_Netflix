import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    marginTop: 20,
    alignItems: 'center',
  },
  itemContainer: {
    width: 320,
    height: 180,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  itemFocused: {
    borderColor: '#e50914',
    transform: [{ scale: 1.05 }],
  },
  img: {
    width: '100%',
    height: '100%',
  },
  lightboxOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxContent: {
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImg: {
    width: '100%',
    height: '80%',
  },
  closeBtn: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
