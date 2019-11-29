import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
// import { Constants } from "expo";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

// To use the following code in your project, you have to install expo-permissions and expo-image-picker:
// expo install expo-permissions
// expo install expo-image-picker

export default function App() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const share = useCallback(() => {
    Share.share({
      message: image,
      title: "Check out this photo",
      url: image
    });
  }, [image]);

  const copyToClipboard = useCallback(() => {
    Clipboard.setString(image);
    alert("Copied image URL to clipboard");
  }, [image]);

  const handleImagePicked = useCallback(async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();

        setImage(uploadResult.location);
      }
    } catch (e) {
      // console.log({ uploadResponse });
      // console.log({ uploadResult });
      // console.log({ e });
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  });

  const takePhoto = useCallback(async () => {
    console.log(image);

    const { status: cameraPerm } = await Permissions.askAsync(
      Permissions.CAMERA
    );

    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === "granted" && cameraRollPerm === "granted") {
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      handleImagePicked(pickerResult);
    }
  });

  const pickImage = useCallback(async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    // only if user allows permission to camera roll
    if (cameraRollPerm === "granted") {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      handleImagePicked(pickerResult);
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      <Text style={styles.exampleText}>Example: Upload ImagePicker result</Text>
      <Button onPress={pickImage} title="Pick an image from camera roll" />
      <Button onPress={takePhoto} title="Take a photo" />

      {image && (
        <View style={styles.maybeRenderContainer}>
          <View style={styles.maybeRenderImageContainer}>
            <Image source={{ uri: image }} style={styles.maybeRenderImage} />
          </View>

          <Text
            onPress={copyToClipboard}
            onLongPress={share}
            style={styles.maybeRenderImageText}
          >
            {image}
          </Text>
        </View>
      )}

      {uploading && (
        <View style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
    </View>
  );
}

async function uploadImageAsync(uri) {
  const apiUrl = "https://file-upload-example-backend-dkhqoilqqn.now.sh/upload";

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

  const uriParts = uri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  const formData = new FormData();
  formData.append("photo", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`
  });

  const options = {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
    }
  };

  return fetch(apiUrl, options);
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: "center"
  },
  maybeRenderUploading: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center"
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 30,
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4
    },
    shadowRadius: 5,
    width: 250
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: "hidden"
  },
  maybeRenderImage: {
    height: 250,
    width: 250
  },
  maybeRenderImageText: {
    paddingHorizontal: 10,
    paddingVertical: 10
  }
});
