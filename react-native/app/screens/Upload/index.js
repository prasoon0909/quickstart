import React, {useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import Button from '../../components/Button';
import Text from '../../components/Text';
import getStyleSheet from './styles';

import {uploadFile} from '../../lib/imagekit';
import Toast from 'react-native-toast-message';

function Upload() {
  let styleSheet = getStyleSheet({});
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [uploading, setUploading] = useState(false); // State for tracking the uploading process

  async function openFileSelector() {
    try {
      setUploadFileUrl('');
      var res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      setUploading(true); // Show loader while uploading

      await uploadFileToImagekit(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        Toast.show({
          type: 'info',
          text1: 'Upload cancelled.',
          position: 'bottom',
        });
      } else {
        throw err;
      }
    } finally {
      setUploading(false); // Hide loader after the upload is complete
    }
  }

  async function uploadFileToImagekit(fileData) {
    try {
      const uploadedFile = await uploadFile(fileData);
      Toast.show({
        type: 'success',
        text1: 'Image uploaded.',
        position: 'bottom',
      });
      setUploadFileUrl(uploadedFile.url);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.message,
        position: 'bottom',
      });
    }
  }

  return (
    <View style={styleSheet.container}>
      <Button
        cssProps={styleSheet.buttonCssProps}
        onPress={() => openFileSelector()}>
        Upload File
      </Button>
      <View style={styleSheet.captionView}>
        {uploading ? (
          <ActivityIndicator size="large" color="#219dad" />
        ) : (
          uploadFileUrl && <Text>Uploaded File - {uploadFileUrl}</Text>
        )}
      </View>
    </View>
  );
}

export default Upload;
