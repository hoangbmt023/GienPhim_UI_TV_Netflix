import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './MovieDetailInfo.styles';

const InfoRow = ({ label, value }: { label: string, value: any }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

export const MovieDetailInfo = ({ movie }: { movie: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.column}>
          <InfoRow label="Tên gốc" value={movie.origin_name} />
          <InfoRow label="Trạng thái" value={movie.episode_current} />
          <InfoRow label="Thời lượng" value={movie.time} />
          <InfoRow label="Ngôn ngữ" value={movie.lang} />
          <InfoRow label="Thể loại" value={movie.category?.map((c: any) => c.name).join(' ')} />
        </View>
        <View style={styles.column}>
          <InfoRow label="Năm" value={movie.year} />
          <InfoRow label="Số tập" value={movie.episode_total} />
          <InfoRow label="Chất lượng" value={movie.quality} />
          <InfoRow label="Loại phim" value={movie.type} />
          <InfoRow label="Quốc gia" value={movie.country?.map((c: any) => c.name).join(', ')} />
        </View>
      </View>
    </View>
  );
};

