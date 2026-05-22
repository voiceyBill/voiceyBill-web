import React from 'react';
import { FlatList, View, ActivityIndicator, Text, StyleSheet, FlatListProps } from 'react-native';

// Usage:
// import FlatListWithEmptyLoader from 'react-native-flatlist-fixes/FlatListEmptyLoader';
// <FlatListWithEmptyLoader
//   data={items}
//   isLoading={isLoading}
//   renderItem={renderItem}
//   keyExtractor={(i) => i.id}
// />

type Props<ItemT> = FlatListProps<ItemT> & {
  isLoading?: boolean;
  emptyMessage?: string;
};

function FlatListWithEmptyLoader<ItemT = any>({
  isLoading = false,
  emptyMessage = 'No items',
  ListEmptyComponent,
  ...rest
}: Props<ItemT>) {
  const EmptyOrLoading = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (ListEmptyComponent) {
      return typeof ListEmptyComponent === 'function'
        ? (ListEmptyComponent as any)()
        : (ListEmptyComponent as any);
    }

    return (
      <View style={styles.center}>
        <Text>{emptyMessage}</Text>
      </View>
    );
  };

  return <FlatList {...(rest as FlatListProps<ItemT>)} ListEmptyComponent={EmptyOrLoading} />;
}

export default FlatListWithEmptyLoader;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
