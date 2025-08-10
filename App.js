import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=50");
      const data = await res.json();
      const formatted = data.map((item, index) => ({
        x: index,
        y: parseFloat(item[4])
      }));
      setPrices(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💹 QuickTrade Neon</Text>
      {loading ? (
        <Text style={styles.loading}>Lade Live-Daten...</Text>
      ) : (
        <ScrollView>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine
              style={{
                data: { stroke: "#00FF9D" },
                parent: { border: "1px solid #ccc"}
              }}
              data={prices}
            />
          </VictoryChart>
        </ScrollView>
      )}
      <Button title="🔄 Aktualisieren" onPress={fetchData} color="#00FF9D" />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  title: {
    fontSize: 26,
    color: "#00FF9D",
    marginTop: 40,
    marginBottom: 20,
    fontWeight: "bold"
  },
  loading: {
    color: "#fff"
  }
});
