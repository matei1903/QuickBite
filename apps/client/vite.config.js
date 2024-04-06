import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactFire from "@react-firebase/reactfire";

export default defineConfig({
  plugins: [react()],
});