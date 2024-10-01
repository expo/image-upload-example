import { ScrollView, Text, View, } from 'react-native';
import { FormItem, FormList } from '@/components/ui/Form';

import * as ImagePicker from 'expo-image-picker';

import * as Colors from '@bacons/apple-colors'
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';

function formDataFromImagePicker(result: ImagePicker.ImagePickerSuccessResult) {

  const formData = new FormData();

  for (const index in result.assets) {
    const asset = result.assets[index];
    // @ts-expect-error: special react native format for form data
    formData.append(`photo.${index}`, {
      uri: asset.uri,
      name: asset.fileName ?? asset.uri.split('/').pop(),
      type: asset.mimeType,
    });

    if (asset.exif) {
      formData.append(`exif.${index}`, JSON.stringify(asset.exif));
    }
  }

  return formData;
}

async function pickImage(options: ImagePicker.ImagePickerOptions) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    aspect: [4, 3],
    ...options,
  });
  if (!result.canceled) {
    const response = await fetch("/api/img", {
      method: 'POST',
      body: formDataFromImagePicker(result),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    return await response.json();
  }
}

export default function HomeScreen() {
  const [results, setResults] = React.useState<string | null>(null);

  const pickImageWithResults = async (options: ImagePicker.ImagePickerOptions) => {
    const result = await pickImage(options);

    setResults(result);
  }
  return (
    <ScrollView
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      <FormList>
        <FormItem onPress={pickImageWithResults.bind(null, {})}>
          <IconSymbol name='photo.stack' size={24} style={{ width: 60 }} color={Colors.systemBlue} />
          <View style={{ gap: 4 }}>
            <Text style={{ color: Colors.label, fontSize: 18, fontWeight: '600' }}>Select media</Text>
            <Text style={{ color: Colors.secondaryLabel, fontSize: 16, }}>Upload to API routes</Text>
          </View>

        </FormItem>
        <FormItem onPress={pickImageWithResults.bind(null, {
          allowsMultipleSelection: true,
        })}>
          <IconSymbol name='photo.on.rectangle' size={20} style={{ width: 60 }} color={Colors.systemBlue} />
          <View style={{ gap: 4 }}>
            <Text style={{ color: Colors.label, fontSize: 18, fontWeight: '600' }}>Select multiple</Text>
          </View>
        </FormItem>

        <FormItem onPress={pickImageWithResults.bind(null, {
          exif: true,
        })}>
          <IconSymbol name='location.fill.viewfinder' size={20} style={{ width: 60 }} color={Colors.systemBlue} />
          <View style={{ gap: 4 }}>
            <Text style={{ color: Colors.label, fontSize: 18, fontWeight: '600' }}>Send exif data</Text>
          </View>
        </FormItem>

      </FormList>

      <FormList>
        <FormItem>
          <View style={{ gap: 4 }}>
            <Text style={{ color: Colors.label, fontSize: 18, fontWeight: '600' }}>Results</Text>
            <Text style={{ color: Colors.secondaryLabel, fontSize: 16, }}>{results ? JSON.stringify(results, null, 2) : 'No results yet'}</Text>
          </View>
        </FormItem>

      </FormList>
    </ScrollView>
  );
}


