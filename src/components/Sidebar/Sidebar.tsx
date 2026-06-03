import React, { useState } from 'react';
import { View, Text, TouchableHighlight, Image } from 'react-native';
import { theme } from '../../constants/theme';
import { styles } from './Sidebar.styles';
import { useTVNavigation, navigationRef } from '../../context/NavigationContext';

const MENU_ITEMS = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'movies', label: 'Phim lẻ' },
  { id: 'series', label: 'Phim bộ' },
  { id: 'animation', label: 'Hoạt hình' },
];

const TouchableHighlightTV = TouchableHighlight as any;

export const Sidebar = ({ activeNodeRef }: { activeNodeRef?: React.MutableRefObject<any> }) => {
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const { currentRoute } = useTVNavigation();

  const getActiveItem = () => {
    switch (currentRoute) {
      case 'Home': return 'home';
      case 'Movies': return 'movies';
      case 'Series': return 'series';
      case 'Anime': return 'animation';
      default: return 'home';
    }
  };

  const activeItem = getActiveItem();

  return (
    <View style={styles.container}>

      {/* LEFT: GIENPHIM Logo */}
      <View style={styles.leftSection}>
        <Text style={styles.brandText}>GIENPHIM</Text>
      </View>

      {/* CENTER: Navigation Menu */}
      <View style={styles.centerSection}>
        {MENU_ITEMS.map((item) => {
          return (
            <TouchableHighlightTV
              key={item.id}
              ref={(el: any) => {
                if (activeItem === item.id && activeNodeRef) {
                  activeNodeRef.current = el; // Lưu reference của item đang active
                }
              }}
              onFocus={() => setFocusedItem(item.id)}
              onBlur={() => setFocusedItem(null)}
              onPress={() => {
                // Sử dụng navigationRef vì Sidebar nằm ngoài Stack.Navigator
                const routeName = item.id === 'movies' ? 'Movies' : 
                                  item.id === 'series' ? 'Series' : 
                                  item.id === 'animation' ? 'Anime' : 'Home';
                if (navigationRef.isReady()) {
                  navigationRef.navigate(routeName);
                }
              }}
              style={[
                styles.menuItem,
                activeItem === item.id && styles.menuItemActive,
                focusedItem === item.id && styles.menuItemFocused
              ]}
              underlayColor="transparent"
              activeOpacity={1}
            >
              <Text style={[
                styles.label,
                item.isPill && styles.pillLabel,
                activeItem === item.id && !item.isPill && styles.textActive,
                focusedItem === item.id && styles.textFocused
              ]}>
                {item.label}
              </Text>
            </TouchableHighlightTV>
          );
        })}
      </View>

      {/* RIGHT: Search + Avatar */}
      <View style={styles.rightSection}>
        {/* Nút Tìm Kiếm (Search Icon) */}
        <TouchableHighlightTV
          onFocus={() => setFocusedItem('search')}
          onBlur={() => setFocusedItem(null)}
          onPress={() => { }}
          style={[
            styles.menuItem,
            styles.searchItem,
            focusedItem === 'search' && styles.menuItemFocused
          ]}
          underlayColor="transparent"
          activeOpacity={1}
        >
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/100/ffffff/search--v1.png' }}
            style={[
              styles.searchIcon,
              focusedItem === 'search' && { tintColor: '#fff' }
            ]}
          />
        </TouchableHighlightTV>

        {/* Avatar */}
        <TouchableHighlightTV
          onFocus={() => setFocusedItem('avatar')}
          onBlur={() => setFocusedItem(null)}
          onPress={() => { }}
          style={[
            styles.avatarWrapper,
            focusedItem === 'avatar' && styles.menuItemFocused
          ]}
          underlayColor="transparent"
          activeOpacity={1}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png' }}
              style={styles.avatar}
            />
            <Text style={styles.arrowDown}>▼</Text>
          </View>
        </TouchableHighlightTV>
      </View>

    </View>
  );
};
