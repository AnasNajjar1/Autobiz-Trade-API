import AWS from 'aws-sdk';
import { ITranslateService } from './translateService';
export class AwsTranslateService implements ITranslateService {
  public constructor() {}

  public async getOriginalLanguage(phrase: string) {
    try {
      const response = await new AWS.Translate({ apiVersion: '2017-07-01' })
        .translateText({
          SourceLanguageCode: 'auto',
          TargetLanguageCode: 'en',
          Text: phrase,
        })
        .promise();
      return response.SourceLanguageCode;
    } catch (err) {
      console.warn(err);
    }
  }

  public async getTranslation(phrase: string, lang: string) {
    try {
      const response = await new AWS.Translate({ apiVersion: '2017-07-01' })
        .translateText({
          SourceLanguageCode: 'auto',
          TargetLanguageCode: lang,
          Text: phrase,
        })
        .promise();
      return response.TranslatedText;
    } catch (err) {
      console.warn(err);
    }
  }
  public async translateText(text: string): Promise<{}> {
    if (!text) {
      return null;
    }

    const sourceLanguage = await this.getOriginalLanguage(text);

    const [fr, de, en, es, it, pt] = await Promise.all([
      this.getTranslation(text, 'fr'),
      this.getTranslation(text, 'de'),
      this.getTranslation(text, 'en'),
      this.getTranslation(text, 'es'),
      this.getTranslation(text, 'it'),
      this.getTranslation(text, 'pt'),
    ]);

    return {
      sourceLanguage,
      translation: {
        fr,
        de,
        en,
        es,
        it,
        pt,
      },
    };
  }
}
