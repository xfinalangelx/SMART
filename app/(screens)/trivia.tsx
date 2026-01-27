import { useAppData } from '@/contexts/AppDataContext';
import bmQuestions from '@/utils/bmQuestions';
import questions from '@/utils/questions';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TriviaScreen() {
  const { state } = useAppData();
  const [language, setLanguage] = useState<'en' | 'bm'>('bm');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);

  const [loaded] = useFonts({
    MontserratBold: require('../../assets/fonts/Montserrat-Bold.ttf'),
    MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
    MontserratMedium: require('../../assets/fonts/Montserrat-Medium.ttf'),
  });

  useEffect(() => {
    if (state?.appData?.settings) {
      setLanguage(state.appData.settings.language);
    }
  }, [state]);

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8F00FF" />
      </View>
    );
  }

  // Use language-specific questions
  const activeQuestions = language === 'bm' ? bmQuestions : questions;
  const currentQuestion = activeQuestions[currentIndex];

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;

    setSelectedAnswer(answer);
    setShowExplanation(true);

    if (answer === currentQuestion.answer) {
      setScore(score + 1);
    }
    setAnsweredQuestions(answeredQuestions + 1);
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      const percentage = Math.round((score / activeQuestions.length) * 100);
      Alert.alert(
        language === 'bm' ? 'Kuiz Selesai!' : 'Quiz Completed!',
        language === 'bm'
          ? `Anda mendapat ${score} daripada ${activeQuestions.length} soalan betul (${percentage}%)`
          : `You got ${score} out of ${activeQuestions.length} correct (${percentage}%)`,
        [
          {
            text: language === 'bm' ? 'Cuba Lagi' : 'Try Again',
            onPress: () => {
              setCurrentIndex(0);
              setScore(0);
              setAnsweredQuestions(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
            },
          },
          {
            text: language === 'bm' ? 'Kembali' : 'Go Back',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const handleExit = () => {
    Alert.alert(
      language === 'bm' ? 'Keluar Kuiz' : 'Exit Quiz',
      language === 'bm' ? 'Adakah anda pasti mahu keluar?' : 'Are you sure you want to exit?',
      [
        { text: language === 'bm' ? 'Batal' : 'Cancel', style: 'cancel' },
        { text: language === 'bm' ? 'Keluar' : 'Exit', onPress: () => router.back() },
      ]
    );
  };

  const isCorrect = selectedAnswer === currentQuestion.answer;

  return (
    <View style={styles.container}>
      <View style={styles.exitButton}>
        <TouchableOpacity onPress={handleExit} style={styles.exitTouchable}>
          <Ionicons name="exit-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['#8F00FF', '#B500B9']} style={styles.header} start={[0, 0]} end={[1, 0]}>
        <Text style={styles.headerText}>
          {language === 'bm' ? 'Soalan' : 'Question'} {currentIndex + 1}/{activeQuestions.length}
        </Text>
        <Text style={styles.scoreText}>
          {language === 'bm' ? 'Skor' : 'Score'}: {score}/{answeredQuestions}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isAnswerCorrect = option === currentQuestion.answer;

            let backgroundColor = '#FFFFFF';
            let borderColor = '#E0E0E0';

            if (showExplanation && isAnswerCorrect) {
              backgroundColor = '#4CAF50';
              borderColor = '#4CAF50';
            } else if (showExplanation && isSelected && !isAnswerCorrect) {
              backgroundColor = '#F44336';
              borderColor = '#F44336';
            } else if (isSelected) {
              borderColor = '#8F00FF';
            }

            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, { backgroundColor, borderColor }]}
                onPress={() => handleAnswerSelect(option)}
                disabled={showExplanation}
              >
                <Text
                  style={[
                    styles.optionText,
                    showExplanation && (isAnswerCorrect || (isSelected && !isAnswerCorrect))
                      ? styles.optionTextWhite
                      : null,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showExplanation && (
          <View style={[styles.explanationCard, { backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={styles.resultText}>
              {isCorrect ? (language === 'bm' ? '✓ Betul!' : '✓ Correct!') : language === 'bm' ? '✗ Salah' : '✗ Incorrect'}
            </Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}

        {showExplanation && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient colors={['#8F00FF', '#B500B9']} style={styles.nextButtonGradient} start={[0, 0]} end={[1, 0]}>
              <Text style={styles.nextButtonText}>
                {currentIndex < activeQuestions.length - 1
                  ? language === 'bm'
                    ? 'Soalan Seterusnya'
                    : 'Next Question'
                  : language === 'bm'
                  ? 'Selesai Kuiz'
                  : 'Finish Quiz'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  exitButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  exitTouchable: {
    padding: 8,
  },
  header: {
    padding: 20,
    paddingTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'MontserratBold',
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
    color: '#333',
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'MontserratMedium',
    color: '#333',
    textAlign: 'center',
  },
  optionTextWhite: {
    color: '#FFFFFF',
  },
  explanationCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    marginBottom: 12,
    color: '#333',
  },
  explanationText: {
    fontSize: 15,
    fontFamily: 'MontserratMedium',
    color: '#555',
    lineHeight: 22,
  },
  nextButton: {
    marginBottom: 20,
  },
  nextButtonGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'MontserratBold',
  },
});
