import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.surakshaar.app',
  appName: 'Suraksha AR',
  webDir: 'dist',
  plugins: {
    SystemBars: {
      insetsHandling: 'disable',
    },
  },
};

export default config;
