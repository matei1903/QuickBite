import { initializeApp } from 'firebase/app';
let app = null
export default () => {
    if (app)
        return app
    const settings={
        apiKey: import.meta.env.VITE_FIRE_CLIENT_API_KEY,
        authDomain: import.meta.env.VITE_FIRE_CLIENT_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIRE_CLIENT_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIRE_CLIENT_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIRE_CLIENT_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIRE_CLIENT_APP_ID
    }
    console.log(settings)
    app = initializeApp(settings)
    console.log(app);
    return app
}