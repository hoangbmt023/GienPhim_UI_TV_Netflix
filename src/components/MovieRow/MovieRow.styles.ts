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
    width: 180, // Slightly smaller card width to fit more on screen
    height: 270,
    marginRight: 24, // Margin between cards
    borderRadius: 6,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  cardFocused: {
    borderColor: theme.colors.text, // White border on focus
  },
  cardInner: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  }
});
