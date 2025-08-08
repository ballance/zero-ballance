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
  Animated,
} from 'react-native';

const App = (): React.JSX.Element => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('5');
  const [inputSeconds, setInputSeconds] = useState('0');
  const [showBanana, setShowBanana] = useState(false);
  const [danceFrame, setDanceFrame] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bananaAnimation = useRef({
    scale: new Animated.Value(1),
    y: new Animated.Value(0),
    x: new Animated.Value(0),
  }).current;

  const getBananaMan = (frame: number) => {
    const frames = [
      // Frame 0 - Classic pose
      `   🍌   
  \\o/  
   |   
  / \\  `,
      // Frame 1 - Left lean
      `  🍌    
 \\o    
  |\\   
 /  \\  `,
      // Frame 2 - Right lean  
      `    🍌  
    o/ 
   /|  
  / \\ `,
      // Frame 3 - Arms up
      `   🍌   
   \\o/ 
    |  
   /|\\ `,
      // Frame 4 - Kick left
      `   🍌   
  /o\\  
   |   
  /    `,
      // Frame 5 - Kick right
      `   🍌   
  /o\\  
   |   
    \\ `,
    ];
    return frames[frame % frames.length];
  };

  const startBananaDance = () => {
    setShowBanana(true);
    setDanceFrame(0);
    
    // Classic banana bounce
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bananaAnimation.y, {
          toValue: -30,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bananaAnimation.y, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );

    // Side-to-side dance movement
    const wiggleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bananaAnimation.x, {
          toValue: 20,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bananaAnimation.x, {
          toValue: -20,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    // Scale pulsing
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bananaAnimation.scale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bananaAnimation.scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();
    wiggleAnimation.start();
    scaleAnimation.start();

    // Animate through dance frames
    let frameCounter = 0;
    const frameInterval = setInterval(() => {
      setDanceFrame(frameCounter % 6);
      frameCounter++;
    }, 200);

    // Stop the banana dance after 6 seconds
    setTimeout(() => {
      bounceAnimation.stop();
      wiggleAnimation.stop();
      scaleAnimation.stop();
      clearInterval(frameInterval);
      setShowBanana(false);
      setDanceFrame(0);
      
      // Reset banana animation
      bananaAnimation.scale.setValue(1);
      bananaAnimation.y.setValue(0);
      bananaAnimation.x.setValue(0);
    }, 6000);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      Vibration.vibrate([0, 500, 200, 500]);
      startBananaDance();
      Alert.alert("🍌 Time's Up!", 'Your countdown has reached zero! Enjoy the dancing banana!');
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
          {showBanana && (
            <Animated.View
              style={[
                styles.bananaContainer,
                styles.bananaCentered,
                {
                  transform: [
                    { scale: bananaAnimation.scale },
                    { translateY: bananaAnimation.y },
                    { translateX: bananaAnimation.x },
                  ],
                },
              ]}>
              <Text style={styles.bananaMan}>{getBananaMan(danceFrame)}</Text>
            </Animated.View>
          )}
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
    paddingVertical: 50,
    backgroundColor: '#0f0f0f',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#cccccc',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#111111',
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  timerDisplay: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#00ff88',
    fontFamily: 'monospace',
    textShadowColor: '#004422',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    marginBottom: 20,
  },
  bananaContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bananaCentered: {
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  bananaMan: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'monospace',
    color: '#FFD700',
    lineHeight: 36,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  inputContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 30,
    marginBottom: 30,
    backgroundColor: '#151515',
    marginHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333333',
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 90,
    height: 60,
    borderRadius: 12,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#555555',
  },
  inputSeparator: {
    fontSize: 32,
    color: '#00ff88',
    fontWeight: 'bold',
    marginHorizontal: 15,
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
    padding: 20,
    borderRadius: 12,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555555',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  presetText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  presetTime: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseButton: {
    backgroundColor: '#ff8800',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#ff8800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  resetButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
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
