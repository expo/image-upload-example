# Image upload with Expo API Routes

This is an Expo Router project that demonstrates choosing images and videos from the device, then uploading them to a server.

Expo uses the web APIs [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) APIs to upload media to an API route.

Getting the media to an API route as soon as possible is recommended as most services and tools have good server support, and it reduces the chance of bugs from device-specific quirks.

The `FormData` approach is optimal as it avoids slow base64 string conversions and memory issues on low-end devices. It works by referencing a local file URL, which is then streamed to the server. From the server, you can access the raw bytes of the file.

- Pick an image or video with [`ImagePicker`](https://docs.expo.dev/versions/latest/sdk/imagepicker/).
- Upload the media with built-in `fetch` and `FormData` APIs.
- Use Expo Router [API routes](https://docs.expo.dev/router/reference/api-routes/) to handle the upload on the server. This can be deployed to hosting providers by following the [API routes deployment guide](https://docs.expo.dev/router/reference/api-routes/#deployment).
- Save the file using a pseudo-database with Node.js `fs` and `path` modules. In production, you'd use a real database like MongoDB or PostgreSQL.

## Get started

1. Install dependencies

   ```bash
   bun install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

You can run the app on iOS, Android, and the web:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Snippets

Uploading a local file to a server on native platforms:

```ts
import { File } from "expo-file-system";

const result = await ImagePicker.launchImageLibraryAsync();

const formData = new FormData();
formData.append(`photo`, new File(result.assets[0].uri));

const response = await fetch("/api/img", {
  method: "POST",
  body: formData,
  headers: { Accept: "application/json" },
});
```

Accessing the uploaded file on the server as a `File` object, `ArrayBuffer`, and `Buffer`:

```ts
export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("photo") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return Response.json({ file, arrayBuffer, buffer });
}
```

Uploading `File` requires using `fetch` from `expo/fetch` as the React Native `fetch` does not support it. The polyfill is included in `utils/fetch-polyfill.ts`.

## Modern Settings

React Native has very limited support for web APIs. We're working on building replacement APIs such as fetch and FormData but these are currently opt-in.

- Enable relative fetch requests: Add the `EXPO_UNSTABLE_DEPLOY_SERVER=1` environment variable to your development environment. This enables relative fetch requests like `fetch('/api/hello')`. When you create production build, the server is deployed and linked to the fetch API automatically. Alternatively, you can use absolute URLs like `fetch('https://mydomain.com/api/hello')` for each request, just be sure to switch the URLs between production and development.
- Use `expo/fetch` polyfill: React Native's fetch does not support `File` objects or streaming, it also uses base64 strings which are much slower for files as you must convert back and forth from binary data to strings. To use `File` objects, you must use the `fetch` polyfill from `expo/fetch`. This is included in `utils/fetch-polyfill.ts`. You can import this file at the top of your app to replace the global fetch with the polyfill.
- Use `File` from `expo-file-system`: Use the `File` class from `expo-file-system` to create `File` objects from local URIs.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```

```
