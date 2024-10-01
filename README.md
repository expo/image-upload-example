# Image upload with Expo API Routes

This is an [Expo Router](https://expo.dev) project to demonstrate choosing media from the device and uploading it to a server.

- Pick an image or video with [`ImagePicker`](https://docs.expo.dev/versions/latest/sdk/imagepicker/).
- Upload the media with built-in `fetch` and `FormData` APIs.
- Use Expo Router [API routes](https://docs.expo.dev/router/reference/api-routes/) to handle the upload on the server. This can be deployed to hosting providers by following the [API routes deployment guide](https://docs.expo.dev/router/reference/api-routes/#deployment).
- Save the file using a pseudo-database with Node.js `fs` and `path` modules. In production, you'd use a real database like MongoDB or PostgreSQL.

## Get started

1. Install dependencies

   ```bash
   npm install
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

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
