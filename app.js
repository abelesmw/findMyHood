import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const App = () => {
  const [neighborhood, setNeighborhood] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // replace with your actual key

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
          );

          const data = await response.json();

          const result = data.results[0].address_components.find(
            component => component.types.includes('neighborhood')
          );

          if (result) {
            setNeighborhood(result.long_name);
          } else {
            setNeighborhood('No neighborhood found');
          }
        } catch (error) {
          console.error(error);
        }
      },
      error => console.error(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {neighborhood ? `You're in ${neighborhood}` : 'Loading...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default App;
