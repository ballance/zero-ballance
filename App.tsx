import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Vibration,
} from 'react-native';

const App = (): React.JSX.Element => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('5');
  const [inputSeconds, setInputSeconds] = useState('0');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      Vibration.vibrate([0, 500, 200, 500]);
      Alert.alert("⏰ Time's Up!", 'Your countdown has reached zero!');
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const startTimer = () => {
    const totalSeconds =
      parseInt(inputMinutes, 10) * 60 + parseInt(inputSeconds, 10);
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsActive(true);
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const presets = [
    {name: 'Rocket Launch', minutes: 10, seconds: 0},
    {name: 'Speed Run', minutes: 3, seconds: 0},
    {name: 'Kitchen Timer', minutes: 15, seconds: 0},
    {name: 'Pomodoro', minutes: 25, seconds: 0},
  ];

  const setPreset = (minutes: number, seconds: number) => {
    setInputMinutes(minutes.toString());
    setInputSeconds(seconds.toString());
    resetTimer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>Zero-Ballance</Text>
          <Text style={styles.subtitle}>Make every second count</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerDisplay}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Set Timer</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputMinutes}
              onChangeText={setInputMinutes}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#666"
            />
            <Text style={styles.inputSeparator}>:</Text>
            <TextInput
              style={styles.input}
              value={inputSeconds}
              onChangeText={setInputSeconds}
              keyboardType="numeric"
              placeholder="00"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.inputLabels}>
            <Text style={styles.timeLabel}>minutes</Text>
            <Text style={styles.timeLabel}>seconds</Text>
          </View>
        </View>

        <View style={styles.presetsContainer}>
          <Text style={styles.presetsTitle}>Quick Presets</Text>
          <View style={styles.presetsGrid}>
            {presets.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.presetButton}
                onPress={() => setPreset(preset.minutes, preset.seconds)}>
                <Text style={styles.presetText}>{preset.name}</Text>
                <Text style={styles.presetTime}>
                  {preset.minutes}:{preset.seconds.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlsContainer}>
          {!isActive ? (
            <TouchableOpacity style={styles.startButton} onPress={startTimer}>
              <Text style={styles.buttonText}>START</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
              <Text style={styles.buttonText}>PAUSE</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
            <Text style={styles.buttonText}>RESET</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Created by Sebastian Ballance - bash at ballance dot it
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    fontStyle: 'italic',
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  timerDisplay: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#00ff88',
    fontFamily: 'monospace',
  },
  inputContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333333',
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80,
    height: 50,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  inputSeparator: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  inputLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
  },
  timeLabel: {
    fontSize: 12,
    color: '#cccccc',
  },
  presetsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  presetsTitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  presetText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  presetTime: {
    color: '#00ff88',
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#ff8800',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: '#666666',
    fontSize: 12,
  },
});

export default App;
