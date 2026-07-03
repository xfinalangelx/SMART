/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

/**
 * SMART framework palette (see SMART infographic):
 * Learn (Pembelajaran) teal, Manage (Pengurusan) purple,
 * Track (Pemantauan) blue, Connect (Sokongan) orange.
 */
export const SmartColors = {
  learn: '#16B394',
  manage: '#7B61FF',
  track: '#3498DB',
  connect: '#F39C12',
  accent: '#FF6B6B',
  text: '#232323',
  textMuted: '#666666',
  background: '#FFFFFF',
  card: '#FFFFFF',
  border: '#00000012',
  success: '#4CAF50',
  danger: '#FF3B30',
  normalBand: 'rgba(76, 175, 80, 0.16)',
  normalBandLine: 'rgba(76, 175, 80, 0.65)',
};

export type SmartModuleKey = 'learn' | 'manage' | 'track' | 'connect';

/** Bilingual names of the four SMART modules. */
export const SmartModules: Record<
  SmartModuleKey,
  { en: string; bm: string; color: string; taglineEn: string; taglineBm: string }
> = {
  learn: {
    en: 'Learn',
    bm: 'Pembelajaran',
    color: SmartColors.learn,
    taglineEn: 'Build knowledge and understand your treatment.',
    taglineBm: 'Bina pengetahuan dan fahami rawatan anda.',
  },
  manage: {
    en: 'Manage',
    bm: 'Pengurusan',
    color: SmartColors.manage,
    taglineEn: 'Plan your care, stay organised and take charge of your health.',
    taglineBm: 'Rancang penjagaan anda dan uruskan kesihatan anda.',
  },
  track: {
    en: 'Track',
    bm: 'Pemantauan',
    color: SmartColors.track,
    taglineEn: 'Record your results and see your health trends over time.',
    taglineBm: 'Rekod keputusan anda dan lihat trend kesihatan anda.',
  },
  connect: {
    en: 'Connect',
    bm: 'Sokongan',
    color: SmartColors.connect,
    taglineEn: 'Find support, resources and people who care for you.',
    taglineBm: 'Cari sokongan, sumber dan komuniti yang menyayangi anda.',
  },
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
