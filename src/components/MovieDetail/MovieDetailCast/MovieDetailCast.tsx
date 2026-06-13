import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { styles } from './MovieDetailCast.styles';

export const MovieDetailCast = ({ cast }: { cast: any[] }) => {
  if (!cast || cast.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.grid}>
          {Array(10).fill(0).map((_, i) => (
            <View key={i} style={styles.castItem}>
              <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
              <View style={{ width: 80, height: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cast.slice(0, 10).map((person: any, index: number) => (
          <View key={index} style={styles.castItem}>
            <View style={styles.avatar}>
              {person.profile_path ? (
                <Image source={{ uri: `https://image.tmdb.org/t/p/w200${person.profile_path}` }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarInitial}>{person.name?.charAt(0) || '?'}</Text>
              )}
            </View>
            <Text style={styles.castName} numberOfLines={2}>{person.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

