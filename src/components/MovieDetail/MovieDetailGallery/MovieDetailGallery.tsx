import React, { useState } from 'react';
import { View, Image, ScrollView, TouchableHighlight, Text, TVFocusGuideView } from 'react-native';
import { styles } from './MovieDetailGallery.styles';

export const MovieDetailGallery = ({ images, onFocusContent, onImagePress, nextFocusUpNode }: { images: string[], onFocusContent?: () => void, onImagePress?: (uri: string) => void, nextFocusUpNode?: number | null }) => {

  if (!images || images.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          {Array(4).fill(0).map((_, i) => (
            <View key={i} style={[styles.itemContainer, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        {images.map((item, index) => (
          <GalleryItem key={index} uri={item} onPress={() => { if(onImagePress) onImagePress(item); }} onFocus={onFocusContent} nextFocusUp={nextFocusUpNode} />
        ))}
      </ScrollView>


    </View>
  );
};

const GalleryItem = ({ uri, onPress, onFocus, nextFocusUp }: { uri: string, onPress: () => void, onFocus?: () => void, nextFocusUp?: number | null }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <TouchableHighlight
      nextFocusUp={nextFocusUp}
      onFocus={() => {
        setFocused(true);
        if (onFocus) onFocus();
      }}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={[styles.itemContainer, focused && styles.itemFocused]}
      underlayColor="transparent"
    >
      <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={{ uri }} style={[styles.img, { position: 'absolute' }]} resizeMode="cover" />
      </View>
    </TouchableHighlight>
  );
};

