import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { AccessToken } from 'react-native-fbsdk-next';
import FacebookSdk from 'react-native-fbsdk-next';
import { ShareDialog } from 'react-native-fbsdk-next';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


const App = () => {

  useEffect(() => {
    FacebookSdk.Settings.initializeSDK();
    const response = FacebookSdk.LoginManager.logInWithPermissions(['public_profile'])
    console.log(response)
  }, [])

  const shareLinkContent = {
    contentType: 'link',
    contentUrl: "https://facebook.com",
    contentDescription: 'Wow, check out this great site!',
  };

  const shareToFacebook = (content: any) => {
    FacebookSdk.ShareDialog.canShow(content).then(
      (canShow) => {
        if (canShow) {
          return ShareDialog.show(content);
        }
      }
    ).then(
      (result) => {
        if (result.isCancelled) {
          console.log('Share cancelled');
        } else {
          console.log('Share success with postId:', result);
        }
      },
      (error) => {
        console.log('Share fail with error: ' + error);
      }
    );
  }

  const handleImageShare = (type: any) => {
    switch (type) {
      case 'camera':
        launchCamera(
          {
            mediaType: 'mixed'
          },
          ({ assets }) => {
            if (assets && assets[0].uri) {
              let shareContent = {
                contentType: 'photo',
                photos: [{
                  imageUrl: assets[0].uri,
                  userGenerated: false,
                  caption: "Hello World"
                }],
                contentDescription: 'Wow, check out this great site!',
              };
              shareToFacebook(shareContent);
            } else {
              Alert.alert("Unable to get image");
            }
          }
        )
        break;
      case 'gallery':
        launchImageLibrary(
          {
            mediaType: 'mixed'
          },
          ({ assets }) => {
            if (assets && assets[0].uri) {
              let shareContent = {
                contentType: 'photo',
                photos: [{
                  imageUrl: assets[0].uri,
                  userGenerated: false,
                  caption: "Hello World"
                }],
                contentDescription: 'Wow, check out this great site!',
              };
              shareToFacebook(shareContent);
            } else {
              Alert.alert("Unable to get image");
            }
          }
        )
        break;
      default:
        break;
    }
  }

  const handleLogin = (error: any, result: any) => {
    if (error) {
      console.log("login has error: ", error);
    } else if (result.isCancelled) {
      console.log("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(
        (data: any) => {
          console.log(data)
        }
      )
    }
  }

  return (
    <View>
      <FacebookSdk.LoginButton
        onLoginFinished={handleLogin}
        onLogoutFinished={() => console.log("logout.")} />
      <TouchableOpacity onPress={() => { shareToFacebook(shareLinkContent) }} style={{
        padding: 20,
        marginVertical: 10,
      }}>
        <Text>Share Link</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { handleImageShare('gallery') }} style={{
        padding: 20,
        marginVertical: 10,
      }}>
        <Text>Share Photo / Video ( from Gallery )</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { handleImageShare("camera") }} style={{
        padding: 20,
        marginVertical: 10,
      }}>
        <Text>Share Photo / Video ( from Camera )</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({})

export default App;