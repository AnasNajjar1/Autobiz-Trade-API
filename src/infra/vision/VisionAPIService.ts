export interface IVisionService {
  getPlatelocation(urlToHidePicture: string): Promise<Response>;
}

export interface PlatePosition {
  x_1: number;
  x_2: number;
  x_3: number;
  x_4: number;
  y_1: number;
  y_2: number;
  y_3: number;
  y_4: number;
}

type Response = PlatePosition[];

export class VisionService implements IVisionService {
  private visionService: IVisionService;

  constructor(visionService: IVisionService) {
    this.visionService = visionService;
  }

  async getPlatelocation(urlToHidePicture: string): Promise<Response> {
    return this.visionService.getPlatelocation(urlToHidePicture);
  }
}
