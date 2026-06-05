import React, { useState, useRef, forwardRef } from 'react';
import { View, Text, TouchableHighlight, findNodeHandle } from 'react-native';
import { styles } from './MovieDetailTabs.styles';

interface MovieDetailTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onTabFocus?: () => void;
  onTabPress?: (id: string) => void;
  nextFocusUpNode?: number | null;
  activeTabRef?: React.MutableRefObject<any>;
}

export const MovieDetailTabs = ({ tabs, activeTab, onTabChange, onTabFocus, onTabPress, nextFocusUpNode, activeTabRef }: MovieDetailTabsProps) => {
  const [focusedTabId, setFocusedTabId] = useState<string | null>(null);
  const tabRefs = useRef<any[]>([]);

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isFocused = focusedTabId === tab.id;

        return (
          <TabButton 
            key={tab.id} 
            ref={(el: any) => {
              tabRefs.current[index] = el;
              if (isActive && activeTabRef) {
                activeTabRef.current = el;
              }
            }}
            nextFocusUp={nextFocusUpNode}
            label={tab.label} 
            isActive={isActive} 
            isFocused={isFocused}
            onPress={(isFromFocus: boolean) => {
              onTabChange(tab.id);
              if (!isFromFocus && onTabPress) {
                onTabPress(tab.id);
              }
            }} 
            onFocus={() => {
              setFocusedTabId(tab.id);
              onTabChange(tab.id);
              if (onTabFocus) onTabFocus();
            }}
            onBlur={() => setFocusedTabId(null)}
          />
        );
      })}
    </View>
  );
};

const TabButton = forwardRef(({ label, isActive, onPress, onFocus, onBlur, nextFocusLeft, nextFocusRight, nextFocusUp }: any, ref: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <TouchableHighlight
      ref={ref}
      nextFocusLeft={nextFocusLeft}
      nextFocusRight={nextFocusRight}
      nextFocusUp={nextFocusUp}
      onFocus={() => {
        setFocused(true);
        if (onFocus) onFocus();
        onPress(true); // isFromFocus = true
      }}
      onBlur={() => {
        setFocused(false);
        if (onBlur) onBlur();
      }}
      onPress={() => onPress(false)} // isFromFocus = false
      underlayColor="transparent"
      style={[
        styles.tabBtn,
        isActive && styles.tabBtnActive,
        focused && styles.tabBtnFocused
      ]}
    >
      <Text style={[
        styles.tabText,
        isActive && styles.tabTextActive,
        focused && styles.tabTextFocused
      ]}>
        {label}
      </Text>
    </TouchableHighlight>
  );
});

