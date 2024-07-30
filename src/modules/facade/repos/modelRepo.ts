export interface IModelRepo {
  getModels(brandLabel: string): Promise<any>;
}
