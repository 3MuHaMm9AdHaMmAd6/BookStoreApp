import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import Material Community Icons from Expo
import Icon from 'react-native-vector-icons/FontAwesome'; // Import appropriate icon
import * as tf from '@tensorflow/tfjs';
import * as FileSystem from 'expo-file-system';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import "@tensorflow/tfjs-react-native";
import * as jpeg from "jpeg-js";
import * as qna from '@tensorflow-models/qna';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import "@tensorflow/tfjs-react-native";

const PassageQuestionAnswer = () => {
  const [passage, setPassage] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [qnaModel, setQnaModel] = useState(null); // State to store the loaded QnA model

  useEffect(() => {
    // Load QnA model asynchronously
    const loadModel = async () => {
      try {
        await tf.setBackend("rn-webgl");
        console.log("backend");
        await tf.ready();
        console.log("tfready");
        const model = await qna.load();
        setQnaModel(model); // Store the loaded model
        setModelLoaded(true);
      } catch (error) {
        console.error('Error loading QnA model:', error);
      }
    };

    loadModel();

    return () => {}; // No cleanup needed
  }, []);

  const handleAnswer = async () => {
    console.log(" method called");
    if (!qnaModel || !modelLoaded) {
      console.log('QnA model not loaded yet.');
      return;
    }
  
    try {
      const answers = await qnaModel.findAnswers(question, passage);
      console.log(answers);
      if (answers && answers.length > 0) {
        firstAnswerWithHighestScore = answers[0];
        textOfTheAnswer = firstAnswerWithHighestScore.text;
        console.log(textOfTheAnswer);
        setAnswer(textOfTheAnswer);
      }
    }
    catch (error) {
      console.error('Error finding answer:', error);
      setAnswer('Error finding answer.'); // Handle error case
    }

  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
      <Card containerStyle={styles.cardHeading}>
          <View style={styles.headingContainer}>
          <MaterialCommunityIcons name="help-circle" size={64} color="#007bff" />
            <Text style={styles.headingText}>Ask Questions</Text>
          </View>
        </Card>
        <Card containerStyle={styles.card}>
          <TextInput
            style={styles.inputPessage}
            multiline={true}
            placeholder="Enter passage"
            value={passage}
            onChangeText={setPassage}
          />
        </Card>
        <Card containerStyle={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Enter question"
            value={question}
            onChangeText={setQuestion}
          />
        </Card>
        <Card containerStyle={styles.loadingCard}>
          {modelLoaded ? (
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxIcon}>
              <Icon name="check" size={20} color="#007bff" />
              </View>
              <Text>Model Loaded</Text>
            </View>
          ) : (
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxIcon}>
                <Icon name="square" size={20} color="#007bff" />
              </View>
              <View style={styles.loadingTextContainer}>
                <Text style={styles.loadingText}>Model Loading...</Text>
              </View>
            </View>
          )}
        </Card>
        <TouchableOpacity onPress={handleAnswer} style={styles.button} disabled={!modelLoaded}>
          <Text style={styles.buttonText}>Find Answer</Text>
        </TouchableOpacity>
        {answer ? (
          <Card containerStyle={styles.answerCard}>
            <Text style={styles.answerHeading}>Answer</Text>
            <Text>{answer}</Text>
          </Card>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  outerContainer: {
    flex: 1,
    backgroundColor: '#D8BFD8',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardHeading: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFf',
    elevation: 3,
    width: '100%'
  },
  container: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15
  },
  card: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  inputPessage: {
    borderColor: '#ccc',
    borderRadius: 5,
    paddingBottom: 40,
    marginBottom: 40,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    padding: 50,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerCard: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center'
  },
  answerHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  loadingCard: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxIcon: {
    marginRight: 20,
  },
  loadingTextContainer: {
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});

export default PassageQuestionAnswer;
