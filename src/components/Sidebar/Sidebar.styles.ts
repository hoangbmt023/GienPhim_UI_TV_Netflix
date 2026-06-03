import { StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    height: 80,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop: 0,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  brandText: {
    color: '#E50914',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  menuItemActive: {
  },
  menuItemFocused: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  pillItem: {
    backgroundColor: 'rgba(109, 109, 110, 0.6)',
    paddingHorizontal: 24,
  },
  pillLabel: {
    color: '#fff',
  },
  label: {
    color: '#888',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  textActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  textFocused: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchItem: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 26,
    height: 26,
    tintColor: '#ccc',
  },
  avatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    padding: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  arrowDown: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});
