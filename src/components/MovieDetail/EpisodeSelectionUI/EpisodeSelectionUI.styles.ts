import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 4,
  },
  
  // Selectors
  selectorRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  selectorBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectorBtnFocused: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ scale: 1.05 }],
  },
  selectorBtnSelected: {
    backgroundColor: '#e50914',
  },
  selectorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  epBox: {
    width: '15.5%', // approx 6 columns with gap
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(40,40,40,0.8)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  epBoxFocused: {
    borderColor: '#fff',
    backgroundColor: 'rgba(80,80,80,0.9)',
    transform: [{ scale: 1.08 }],
    elevation: 10,
    zIndex: 10,
  },
  epBoxPlaying: {
    borderColor: '#e50914',
    borderWidth: 2,
  },
  epNumberText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  epNameText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  playingText: {
    color: '#e50914',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  }
});
