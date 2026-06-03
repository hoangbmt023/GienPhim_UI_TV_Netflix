import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableHighlight, Image, Animated } from 'react-native';
import { theme } from '../../constants/theme';
import { imgUrl } from '../../services/ophimApi';
import { styles } from './MovieRow.styles';

interface MovieRowProps {
  title: string;
  items: any[];
  loading?: boolean;
}

export const MovieRow = ({ title, items, loading }: MovieRowProps) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={{ color: theme.colors.textMuted, marginLeft: theme.spacing.xxl }}>Đang tải...</Text>
      </View>
    );
  }
  
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.rowTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {items.map((item, index) => {
          return (
            <MovieCard key={item._id || index} item={item} />
          );
        })}
      </ScrollView>
    </View>
  );
};

const MovieCard = ({ item }: { item: any }) => {
  const [focused, setFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.1, // Zoom 110% like Netflix
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  return (
    <TouchableHighlight
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPress={() => console.log('Press movie', item.name)}
      activeOpacity={1}
      underlayColor="transparent"
      style={{ marginRight: theme.spacing.m, borderRadius: 8 }}
    >
      <Animated.View style={[
        styles.card, 
        focused && styles.cardFocused,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={styles.cardInner}>
          <Image 
            source={{ uri: imgUrl(item.thumb_url) }} 
            style={styles.image} 
            resizeMode="cover"
          />
        </View>
      </Animated.View>
    </TouchableHighlight>
  );
}
