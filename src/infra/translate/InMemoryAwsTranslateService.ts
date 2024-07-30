import { ITranslateService } from './translateService';

export class InMemoryAwsTranslateService implements ITranslateService {
  constructor() {}

  public async getOriginalLanguage(phrase: string) {
    return 'fr';
  }

  public async getTranslation(phrase: string, lang: string) {
    return phrase;
  }
  public async translateText(text: string): Promise<{}> {
    if (!text) {
      return null;
    }

    return {
      sourceLanguage: 'fr',
      translation: {
        fr: text,
        de: text,
        en: text,
        es: text,
        it: text,
        pt: text,
      },
    };
  }
}
