import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.unirides.myreactapp',
  appName: 'unirides',
  webDir: 'build',
  "server": {
    "androidScheme": "https",
    "hostname": "unirides-5913a.firebaseapp.com"
  }
};



export default config;
