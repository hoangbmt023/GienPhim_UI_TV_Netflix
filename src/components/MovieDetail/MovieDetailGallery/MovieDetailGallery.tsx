import React, { useState, useRef, useEffect } from 'react';
import { View, Image, ScrollView, TouchableHighlight, Text, TVFocusGuideView, findNodeHandle } from 'react-native';
import { styles } from './MovieDetailGallery.styles';

export const MovieDetailGallery = ({ images, onFocusContent, onImagePress, nextFocusUpNode }: { images: string[], onFocusContent?: () => void, onImagePress?: (uri: string) => void, nextFocusUpNode?: number | null }) => {
  const itemRefs = useRef<any[]>([]);
  const [itemNodes, setItemNodes] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setItemNodes(itemRefs.current.map(el => findNodeHandle(el)).filter(n => n) as number[]);
    }, 100);
  }, [images]);

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
          <GalleryItem 
            key={index} 
            innerRef={(el: any) => itemRefs.current[index] = el}
            uri={item} 
            onPress={() => { if(onImagePress) onImagePress(item); }} 
            onFocus={onFocusContent} 
            nextFocusUp={nextFocusUpNode} 
            nextFocusLeft={index === 0 ? itemNodes[images.length - 1] : undefined}
            nextFocusRight={index === images.length - 1 ? itemNodes[0] : undefined}
          />
        ))}
      </ScrollView>


    </View>
  );
};

const GalleryItem = ({ uri, onPress, onFocus, nextFocusUp, nextFocusLeft, nextFocusRight, innerRef }: { uri: string, onPress: () => void, onFocus?: () => void, nextFocusUp?: number | null, nextFocusLeft?: number | null, nextFocusRight?: number | null, innerRef?: any }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <TouchableHighlight
      ref={innerRef}
      nextFocusLeft={nextFocusLeft}
      nextFocusRight={nextFocusRight}
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

