import { ScrollView, Text, View } from "react-native";
import { FormItem, FormList } from "@/components/ui/Form";

import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import * as Colors from "@bacons/apple-colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React from "react";
import { base64ToFile } from "@/utils/base64";

function formDataFromImagePicker(result: ImagePicker.ImagePickerSuccessResult) {
  const formData = new FormData();

  for (const index in result.assets) {
    const asset = result.assets[index];

    if (asset.base64) {
      formData.append(
        `photo.${index}`,
        // Avoid using base64, but some APIs only return base64 so we support it.
        base64ToFile(asset.base64, asset.fileName)
      );
    } else {
      formData.append(
        `photo.${index}`,
        // asset.file is returned on web only as of SDK 54.
        asset.file ??
          // We can create a File from the URI on native.
          new File(asset.uri)
      );
    }

    if (asset.exif) {
      formData.append(`exif.${index}`, JSON.stringify(asset.exif));
    }
  }

  return formData;
}

async function pickImage(options: ImagePicker.ImagePickerOptions) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    ...options,
  });
  if (!result.canceled) {
    console.log(result.assets[0].file);
    // Upload the image to the API route.
    const response = await fetch("/api/img", {
      method: "POST",
      body: formDataFromImagePicker(result),
      headers: {
        Accept: "application/json",
      },
    });
    return await response.json();
  }
}

export default function HomeScreen() {
  const [results, setResults] = React.useState<string | null>(null);

  const pickImageWithResults = async (
    options: ImagePicker.ImagePickerOptions
  ) => {
    const result = await pickImage(options);

    setResults(result);
  };
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      <FormList>
        <FormItem onPress={pickImageWithResults.bind(null, {})}>
          <IconSymbol
            name="photo.stack"
            size={24}
            style={{ width: 60 }}
            color={Colors.systemBlue}
          />
          <View style={{ gap: 4 }}>
            <Text
              style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}
            >
              Select media
            </Text>
            <Text style={{ color: Colors.secondaryLabel, fontSize: 16 }}>
              Upload to API routes
            </Text>
          </View>
        </FormItem>

        <FormItem
          onPress={pickImageWithResults.bind(null, {
            base64: true,
          })}
        >
          <IconSymbol
            name="photo.stack"
            size={24}
            style={{ width: 60 }}
            color={Colors.systemBlue}
          />
          <View style={{ gap: 4 }}>
            <Text
              style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}
            >
              Select media
            </Text>
            <Text style={{ color: Colors.secondaryLabel, fontSize: 16 }}>
              Upload with base64 (slower)
            </Text>
          </View>
        </FormItem>

        <FormItem
          onPress={pickImageWithResults.bind(null, {
            allowsMultipleSelection: true,
          })}
        >
          <IconSymbol
            name="photo.on.rectangle"
            size={20}
            style={{ width: 60 }}
            color={Colors.systemBlue}
          />
          <View style={{ gap: 4 }}>
            <Text
              style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}
            >
              Select multiple
            </Text>
          </View>
        </FormItem>

        <FormItem
          onPress={pickImageWithResults.bind(null, {
            exif: true,
          })}
        >
          <IconSymbol
            name="location.fill.viewfinder"
            size={20}
            style={{ width: 60 }}
            color={Colors.systemBlue}
          />
          <View style={{ gap: 4 }}>
            <Text
              style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}
            >
              Send exif data
            </Text>
          </View>
        </FormItem>
      </FormList>

      <FormList>
        <FormItem>
          <View style={{ gap: 4 }}>
            <Text
              style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}
            >
              Results
            </Text>
            <Text style={{ color: Colors.secondaryLabel, fontSize: 16 }}>
              {results ? JSON.stringify(results, null, 2) : "No results yet"}
            </Text>
          </View>
        </FormItem>
      </FormList>
    </ScrollView>
  );
}
