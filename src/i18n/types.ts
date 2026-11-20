import type en from './locales/en';

/** English is the reference dictionary: its keys define what every other locale must provide. */
export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
