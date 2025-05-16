
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3e958cdc18314910a1d2de107499e48f',
  appName: 'grade-glimpse-gpa-genius',
  webDir: 'dist',
  server: {
    url: 'https://3e958cdc-1831-4910-a1d2-de107499e48f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  }
};

export default config;
