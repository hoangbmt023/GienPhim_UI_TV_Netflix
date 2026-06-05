import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  box: {
    width: 640,
    height: 360,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  playIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 30,
  },
  netflixBtn: {
    backgroundColor: 'rgba(51, 51, 51, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    minWidth: 140,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  netflixBtnFocused: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    transform: [{ scale: 1.1 }],
  },
  netflixBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  netflixBtnIcon: {
    color: '#fff',
    fontSize: 18,
  },
  netflixBtnLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  netflixTextFocused: {
    color: '#141414',
  },
  hint: {
    color: '#666',
    marginTop: 24,
    fontSize: 14,
  }
});
