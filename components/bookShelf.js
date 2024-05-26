import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, Button } from 'react-native';
import Pdf from 'react-native-pdf';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [pdfSource, setPdfSource] = useState(null);
  const pdfRef = useRef();

  const generatePdf = async (generateBase64) => {
    let fileUri;
    
    // Allow the user to select a PDF file using Document Picker
    const file = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    
    if (file.type === 'success') {
      fileUri = file.uri;
    } else {
      console.log('No PDF file selected.');
      return;
    }

    const newSource = {
      uri: generateBase64 ? `data:application/pdf;base64,${file.base64}` : fileUri,
      cache: true
    };

    setPdfSource(newSource);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Change Page" onPress={() => pdfRef.current.setPage(18)} />
      <Button title="Generate PDF" onPress={() => generatePdf(false)} />
      <Button title="Generate Base64 PDF" onPress={() => generatePdf(true)} />
      <Pdf
        trustAllCerts={false}
        ref={pdfRef} 
        source={pdfSource}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 32
  },
  pdf: {
    flex: 1,
    alignSelf: "stretch"
  }
});
