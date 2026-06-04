import { StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: '#333',
  },
  cardFocused: {
    borderColor: '#fff',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  infoPane: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: 80,
    maxWidth: '75%',
  },
  infoMeta: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoDesc: {
    color: '#ccc',
    fontSize: 18,
    lineHeight: 28,
  },
  skeletonBox: {
    backgroundColor: '#333',
    borderColor: '#333',
    borderRadius: 8,
  }
});
