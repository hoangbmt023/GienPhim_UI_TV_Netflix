import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 30,
    width: '80%',
    alignSelf: 'center', // Căn giữa màn hình
    marginTop: 10, // Cách tab và banner một khoảng nhỏ
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#888',
    fontSize: 18,
    width: 140,
    fontWeight: '600',
  },
  infoValue: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
  }
});
