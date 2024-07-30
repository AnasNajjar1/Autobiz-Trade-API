export interface ITranslateService {
  getOriginalLanguage(phrase: string): Promise<string>;
  getTranslation(phrase: string, lang: string): Promise<string>;
  translateText(phrase: string): Promise<{}>;
}
