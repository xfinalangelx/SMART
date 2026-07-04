import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export type FilterOption = { key: string; label: string };

/**
 * Horizontal scrollable chip row used to filter directory lists (e.g. by
 * state or service type). The first chip is typically an "All" option.
 */
export default function FilterChips({
  options,
  selected,
  onSelect,
  activeColor,
}: {
  options: FilterOption[];
  selected: string;
  onSelect: (key: string) => void;
  activeColor: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const isActive = option.key === selected;
        return (
          <TouchableOpacity
            key={option.key}
            onPress={() => onSelect(option.key)}
            style={[
              styles.chip,
              { borderColor: activeColor },
              isActive && { backgroundColor: activeColor },
            ]}
          >
            <Text style={[styles.chipText, { color: isActive ? '#FFFFFF' : activeColor }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'MontserratSemiBold',
  },
});
