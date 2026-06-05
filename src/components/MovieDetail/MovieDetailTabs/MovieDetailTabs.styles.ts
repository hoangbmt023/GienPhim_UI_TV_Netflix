import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 10,
    width: '100%',
  },
  tabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
    marginBottom: -1, // To overlap the container's bottom border
  },
  tabBtnActive: {
    borderBottomColor: '#e50914',
  },
  tabBtnFocused: {
    borderBottomColor: '#e50914',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabTextFocused: {
    color: '#fff',
  }
});
