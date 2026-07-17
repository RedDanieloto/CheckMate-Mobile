import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calendar Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
});
