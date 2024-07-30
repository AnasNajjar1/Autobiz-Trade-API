import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { Pointofsale } from '../../pointofsale/domain/pointofsale';
import { VehicleCarPictures } from './vehicleCarPictures';
import { VehicleCarPicturesOthers } from './vehicleCarPicturesOthers';
import { VehicleConstructorEquipments } from './vehicleConstructorEquipments';
import { VehicleDamages } from './vehicleDamages';
import { VehicleDeclaredEquipments } from './vehicleDeclaredEquipments';
import { VehicleDocuments } from './vehicleDocuments';
import { VehicleFileNumber } from './vehicleFileNumber';
import { VehicleKeyPoints } from './vehicleKeyPoints';
import { VehicleProfileCosts } from './vehicleProfileCosts';
import { VehicleWheelsDimension } from './vehicleWheelsDimensions';
import equipmentsSchema from '../../../shared/schemas/equipments.json';
import { getVehiclesPicturesOthers } from '../../../shared/helpers/VehicleHelper';
import _ from 'lodash';

export interface VehicleProps {
  // IDS
  id?: number;
  uuid?: string;
  fileNumber: VehicleFileNumber;
  vin?: string;

  // GENERAL INFO
  brandLabel?: string;
  modelLabel?: string;
  versionLabel?: string;
  firstRegistrationDate?: Date;
  profileCosts?: VehicleProfileCosts;
  profileBodyCosts?: VehicleProfileCosts;

  // CAR PICTURES
  carPictures?: VehicleCarPictures;
  carPicturesOthers?: VehicleCarPicturesOthers;
  carPicturesMain?: any;
  carPicturesEncheresVo?: any;
  featuredPicture?: string;

  // DAMANGES
  damages?: VehicleDamages;

  // POINT OF SALE
  pointOfSaleId?: number;
  pointofsale?: Pointofsale;

  // KEY POINTS
  keyPoints?: VehicleKeyPoints;

  // DOCUMENTS
  documents?: VehicleDocuments;

  // EQUIPMENTS
  declaredEquipments?: VehicleDeclaredEquipments;
  constructorEquipments?: VehicleConstructorEquipments;

  // CHARACTERISTICS
  mileage?: number;
  fuelLabel?: string;
  liter?: number;
  gearBoxLabel?: string;
  seats?: number;
  door?: number;
  ch?: number;
  kw?: number;
  fiscal?: number;
  wheelsFrontDimensions?: VehicleWheelsDimension;
  wheelsBackDimensions?: VehicleWheelsDimension;
  wheelsFrontTireBrand?: string;
  wheelsBackTireBrand?: string;
  rimTypeFront?: string;
  rimTypeBack?: string;
  metallic?: boolean;

  // ADMINISTRATIVE DETAILS
  purchaseDate?: Date;
  gcDate?: Date;
  registration?: string;
  firstHand?: boolean;
  vehicleType?: string;
  co2?: number;
  userManual?: string;
  secondSetKey?: string;

  //HISTORY
  origin?: string;
  purchaseInvoice?: string;
  vat?: boolean;
  vatDetails?: string;
  imported?: boolean;

  //SERVICING
  servicingHistory?: string;
  servicingInBrandNetwork?: boolean;
  servicingManualPicture?: string;
  servicingInvoices?: boolean;
  lastServicingDate?: string;
  lastServicingKm?: number;
  distributionBelt?: string;
  nextTechnicalCheckDate?: string;

  //FREVO
  reconditioningCostsMerchant?: number;

  //MARKET
  b2cMarketValue?: number;
  standardMileage?: number;
  dpaProAmt?: number;
  salesSpeedName?: string;
  marketLink?: string;
  marketDataDate?: Date;

  // LOGGING
  userId?: string;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  // SUPERVISOR
  entryStockDate?: Date;

  color?: string;
  thumbnail?: string;
}

export class Vehicle extends AggregateRoot<VehicleProps> {
  constructor(props: VehicleProps, id?: number) {
    super(props, id);
    if (!id) {
      props.uuid = uuidv4();
    }
  }

  // IDS
  get uuid(): string {
    return this.props.uuid;
  }

  get fileNumber(): VehicleFileNumber {
    return this.props.fileNumber;
  }
  public updateFileNumber(value: VehicleFileNumber): Result<void> {
    this.props.fileNumber = value;
    return Result.ok<void>();
  }
  get vin(): string {
    return this.props.vin;
  }
  public updateVin(value: string): Result<void> {
    this.props.vin = value;
    return Result.ok<void>();
  }
  // -- IDS

  // GENERAL INFO
  get brandLabel(): string {
    return this.props.brandLabel;
  }
  public updateBrandLabel(value: string): Result<void> {
    this.props.brandLabel = value;
    return Result.ok<void>();
  }

  get modelLabel(): string {
    return this.props.modelLabel;
  }
  public updateModelLabel(modelLabel: string): Result<void> {
    this.props.modelLabel = modelLabel;
    return Result.ok<void>();
  }

  get color(): string {
    return this.props.color;
  }

  public updateColor(value: string): Result<void> {
    this.props.color = value;
    return Result.ok<void>();
  }

  get versionLabel(): string {
    return this.props.versionLabel;
  }
  public updateVersionLabel(versionLabel: string): Result<void> {
    this.props.versionLabel = versionLabel;
    return Result.ok<void>();
  }

  get firstRegistrationDate(): Date {
    return this.props.firstRegistrationDate;
  }
  public updateFirstRegistrationDate(
    firstRegistrationDate: Date,
  ): Result<void> {
    this.props.firstRegistrationDate = firstRegistrationDate;
    return Result.ok<void>();
  }

  get profileCosts(): VehicleProfileCosts {
    return this.props.profileCosts;
  }
  public updateProfileCosts(value: VehicleProfileCosts): Result<void> {
    this.props.profileCosts = value;
    return Result.ok<void>();
  }

  get profileBodyCosts(): VehicleProfileCosts {
    return this.props.profileBodyCosts;
  }

  public updateProfileBodyCosts(value: VehicleProfileCosts): Result<void> {
    this.props.profileBodyCosts = value;
    return Result.ok<void>();
  }
  // -- GENERAL INFO

  // CAR PICTURES
  get carPictures(): VehicleCarPictures {
    return this.props.carPictures;
  }

  public updateCarPictures(value: VehicleCarPictures): Result<void> {
    this.props.carPictures = value;
    return Result.ok<void>();
  }

  get featuredPicture(): string {
    const { value } = this.props.carPictures;
    if (value?.three_quarters_front_picture) {
      return value.three_quarters_front_picture;
    }
    if (value?.front_picture) {
      return value.front_picture;
    }

    if (value?.left_side_picture) {
      return value.left_side_picture;
    }
    if (value?.right_side_picture) {
      return value.right_side_picture;
    }
    return null;
  }

  get carPicturesMain(): any {
    return {
      three_quarters_front_picture:
        this.props.carPictures.value?.three_quarters_front_picture,
      front_picture: this.props.carPictures.value?.front_picture,
      left_side_picture: this.props.carPictures.value?.left_side_picture,
      right_side_picture: this.props.carPictures.value?.right_side_picture,
      back_picture: this.props.carPictures.value?.back_picture,
      motor_picture: this.props.carPictures.value?.motor_picture,
      trunk_picture: this.props.carPictures.value?.trunk_picture,
      inside_front_picture: this.props.carPictures.value?.inside_front_picture,
      dashboard_picture: this.props.carPictures.value?.dashboard_picture,
      inside_back_picture: this.props.carPictures.value?.inside_back_picture,
      counter_picture: this.props.carPictures.value?.counter_picture,
      vin_picture: this.props.carPictures.value?.vin_picture,
    };
  }

  get carPicturesEncheresVo(): any {
    return {
      back_picture: this.props.carPictures.value?.back_picture,
      counter_picture: this.props.carPictures.value?.counter_picture,
      dashboard_picture: this.props.carPictures.value?.dashboard_picture,
      front_picture: this.props.carPictures.value?.front_picture,
      inside_back_picture: this.props.carPictures.value?.inside_back_picture,
      inside_front_picture: this.props.carPictures.value?.inside_front_picture,
      left_side_picture: this.props.carPictures.value?.left_side_picture,
      motor_picture: this.props.carPictures.value?.motor_picture,
      right_side_picture: this.props.carPictures.value?.right_side_picture,
      three_quarters_back_picture:
        this.props.carPictures.value?.three_quarters_back_picture,
      three_quarters_front_picture:
        this.props.carPictures.value?.three_quarters_front_picture,
      trunk_picture: this.props.carPictures.value?.trunk_picture,
      wheels_back_left_picture : this.props.carPictures.value?.wheels_back_left_picture,
      wheels_back_right_picture: this.props.carPictures.value?.wheels_back_right_picture,
      wheels_front_left_picture: this.props.carPictures.value?.wheels_front_left_picture,
      wheels_front_right_picture: this.props.carPictures.value?.wheels_front_right_picture
    };
  }

  public gallery(): any {
    const gallery = [];

    Object.keys(this.carPicturesMain).map((i) => {
      this.carPicturesMain[i]
        ? gallery.push({ key: i, value: this.carPicturesMain[i] })
        : null;
    });

    this.carPicturesOthers.value?.map((o) => {
      gallery.push({ key: o.title, value: o.link });
    });

    return gallery;
  }

  public photos(): any {
    const gallery = [];

    Object.keys(this.carPicturesEncheresVo).map((i) => {
      this.carPicturesEncheresVo[i]
        ? gallery.push(this.carPicturesEncheresVo[i])
        : null;
    });

    return gallery;
  }

  public fundamentalPictures(): any {
    const filterPictures = [
      'three_quarters_front_picture',
      'left_side_picture',
      'back_picture',
      'three_quarters_front_right_picture',
      'dashboard_picture',
    ];
    const gallery = this.gallery().filter((picture) =>
      filterPictures.includes(picture.key),
    );
    const thumbnail = _.findIndex(gallery, {
      key: 'three_quarters_front_picture',
    });
    if (this.thumbnail && thumbnail !== -1)
      gallery[thumbnail].value = this.thumbnail;
    return gallery;
  }

  get carPicturesOthers(): any {
    if (!this.props.carPicturesOthers?.value) {
      const extractCarPicturesOthers = getVehiclesPicturesOthers(
        this.props.carPictures?.value,
      );
      const carPicturesOthersOrError = VehicleCarPicturesOthers.create(
        extractCarPicturesOthers,
      );
      const carPicturesOthers: VehicleCarPicturesOthers =
        carPicturesOthersOrError.getValue();
      this.updateCarPicturesOthers(carPicturesOthers);
    }
    return this.props.carPicturesOthers;
  }

  public updateCarPicturesOthers(
    value: VehicleCarPicturesOthers,
  ): Result<void> {
    this.props.carPicturesOthers = value;
    return Result.ok<void>();
  }

  public updateGallery(
    carPictures: VehicleCarPictures,
    carPicturesOthers: VehicleCarPicturesOthers,
  ): Result<void> {
    this.props.carPictures = carPictures;
    this.props.carPicturesOthers = carPicturesOthers;
    return Result.ok<void>();
  }

  // -- CAR PICTURES

  // DAMANGES
  get damages(): VehicleDamages {
    return this.props.damages;
  }
  public updateDamages(value: VehicleDamages): Result<void> {
    this.props.damages = value;
    return Result.ok<void>();
  }
  // -- DAMANGES

  // POINT OF SALE
  get pointOfSaleId(): number {
    return this.props.pointOfSaleId;
  }
  public updatePointOfSaleId(pointOfSaleId: number): Result<void> {
    this.props.pointOfSaleId = pointOfSaleId;
    return Result.ok<void>();
  }

  get pointofsale(): Pointofsale {
    return this.props.pointofsale;
  }
  // -- POINT OF SALE

  // KEY POINTS
  get keyPoints(): VehicleKeyPoints {
    return this.props.keyPoints;
  }
  public updateKeyPoints(value: VehicleKeyPoints): Result<void> {
    this.props.keyPoints = value;
    return Result.ok<void>();
  }
  // -- KEY POINTS

  // DOCUMENTS
  get documents(): VehicleDocuments {
    return this.props.documents;
  }
  public updateDocuments(value: VehicleDocuments): Result<void> {
    this.props.documents = value;
    return Result.ok<void>();
  }
  // -- DOCUMENTS

  // EQUIPMENTS
  get declaredEquipments(): VehicleDeclaredEquipments {
    return this.props.declaredEquipments;
  }
  public updateDeclaredEquipments(
    value: VehicleDeclaredEquipments,
  ): Result<void> {
    this.props.declaredEquipments = value;
    return Result.ok<void>();
  }

  get constructorEquipments(): VehicleConstructorEquipments {
    return this.props.constructorEquipments;
  }
  public updateConstructorEquipments(
    value: VehicleConstructorEquipments,
  ): Result<void> {
    this.props.constructorEquipments = value;
    return Result.ok<void>();
  }

  public rankedConstructorEquipments() {
    if (!this.props.constructorEquipments?.value) {
      return null;
    }
    const ranks = [
      'other',
      'veryImportantDatEquipment',
      'importantDatEquipment',
      'fewImportantDatEquipment',
    ];
    const rankedConstructorEquipments = {
      other: [],
      veryImportantDatEquipment: [],
      importantDatEquipment: [],
      fewImportantDatEquipment: [],
    };
    const schema = equipmentsSchema;
    Object.entries(schema).map(([key, value]) => {
      Object.values(this.props.constructorEquipments?.value).map((item) => {
        if (item === value.key) {
          rankedConstructorEquipments[ranks[value.rank]].push(item);
        }
      });
    });

    return rankedConstructorEquipments;
  }
  // -- EQUIPMENTS

  // CHARACTERISTICS
  get mileage(): number {
    return this.props.mileage;
  }
  public updateMileage(mileage: number): Result<void> {
    this.props.mileage = mileage;
    return Result.ok<void>();
  }

  get fuelLabel(): string {
    return this.props.fuelLabel;
  }
  public updateFuelLabel(fuelLabel: string): Result<void> {
    this.props.fuelLabel = fuelLabel;
    return Result.ok<void>();
  }

  get liter(): number {
    return this.props.liter;
  }
  public updateLiter(liter: number): Result<void> {
    this.props.liter = liter;
    return Result.ok<void>();
  }

  get gearBoxLabel(): string {
    return this.props.gearBoxLabel;
  }
  public updateGearBoxLabel(gearBoxLabel: string): Result<void> {
    this.props.gearBoxLabel = gearBoxLabel;
    return Result.ok<void>();
  }

  get seats(): number {
    return this.props.seats;
  }
  public updateSeats(seats: number): Result<void> {
    this.props.seats = seats;
    return Result.ok<void>();
  }

  get door(): number {
    return this.props.door;
  }
  public updateDoor(door: number): Result<void> {
    this.props.door = door;
    return Result.ok<void>();
  }

  get ch(): number {
    return this.props.ch;
  }
  public updateCh(ch: number): Result<void> {
    this.props.ch = ch;
    return Result.ok<void>();
  }

  get kw(): number {
    return this.props.kw;
  }
  public updateKw(kw: number): Result<void> {
    this.props.kw = kw;
    return Result.ok<void>();
  }

  get fiscal(): number {
    return this.props.fiscal;
  }
  public updateFiscal(fiscal: number): Result<void> {
    this.props.fiscal = fiscal;
    return Result.ok<void>();
  }

  get wheelsFrontDimensions(): VehicleWheelsDimension {
    return this.props.wheelsFrontDimensions;
  }
  public updateWheelsFrontDimensions(
    value: VehicleWheelsDimension,
  ): Result<void> {
    this.props.wheelsFrontDimensions = value;
    return Result.ok<void>();
  }

  get wheelsBackDimensions(): VehicleWheelsDimension {
    return this.props.wheelsBackDimensions;
  }
  public updateWheelsBackDimensions(
    value: VehicleWheelsDimension,
  ): Result<void> {
    this.props.wheelsBackDimensions = value;
    return Result.ok<void>();
  }

  get wheelsFrontTireBrand(): string {
    return this.props.wheelsFrontTireBrand;
  }
  public updateWheelsFrontTireBrand(value: string): Result<void> {
    this.props.wheelsFrontTireBrand = value;
    return Result.ok<void>();
  }

  get wheelsBackTireBrand(): string {
    return this.props.wheelsBackTireBrand;
  }
  public updateWheelsBackTireBrand(value: string): Result<void> {
    this.props.wheelsBackTireBrand = value;
    return Result.ok<void>();
  }

  get rimTypeFront(): string {
    return this.props.rimTypeFront;
  }
  public updateRimTypeFront(rimTypeFront: string): Result<void> {
    this.props.rimTypeFront = rimTypeFront;
    return Result.ok<void>();
  }

  get rimTypeBack(): string {
    return this.props.rimTypeBack;
  }
  public updateRimTypeBack(rimTypeBack: string): Result<void> {
    this.props.rimTypeBack = rimTypeBack;
    return Result.ok<void>();
  }

  get metallic(): boolean {
    return this.props.metallic;
  }
  public updateMetallic(metallic: boolean): Result<void> {
    this.props.metallic = metallic;
    return Result.ok<void>();
  }
  // -- CHARACTERISTICS

  // ADMINISTRATIVE DETAILS
  get purchaseDate(): Date {
    return this.props.purchaseDate;
  }
  public updatePurchaseDate(purchaseDate: Date): Result<void> {
    this.props.purchaseDate = purchaseDate;
    return Result.ok<void>();
  }

  get gcDate(): Date {
    return this.props.gcDate;
  }
  public updateGcDate(gcDate: Date): Result<void> {
    this.props.gcDate = gcDate;
    return Result.ok<void>();
  }

  get registration(): string {
    return this.props.registration;
  }
  public updateRegistration(registration: string): Result<void> {
    this.props.registration = registration;
    return Result.ok<void>();
  }

  get firstHand(): boolean {
    return this.props.firstHand;
  }
  public updateFirstHand(firstHand: boolean): Result<void> {
    this.props.firstHand = firstHand;
    return Result.ok<void>();
  }

  get vehicleType(): string {
    return this.props.vehicleType;
  }
  public updateVehicleType(vehicleType: string): Result<void> {
    this.props.vehicleType = vehicleType;
    return Result.ok<void>();
  }

  get co2(): number {
    return this.props.co2;
  }
  public updateCo2(co2: number): Result<void> {
    this.props.co2 = co2;
    return Result.ok<void>();
  }

  get userManual(): string {
    return this.props.userManual;
  }
  public updateUserManual(userManual: string): Result<void> {
    this.props.userManual = userManual;
    return Result.ok<void>();
  }

  get secondSetKey(): string {
    return this.props.secondSetKey;
  }
  public updateSecondSetKey(secondSetKey: string): Result<void> {
    this.props.secondSetKey = secondSetKey;
    return Result.ok<void>();
  }
  // -- ADMINISTRATIVE DETAILS

  // HISTORY
  get origin(): string {
    return this.props.origin;
  }
  public updateOrigin(origin: string): Result<void> {
    this.props.origin = origin;
    return Result.ok<void>();
  }

  get purchaseInvoice(): string {
    return this.props.purchaseInvoice;
  }
  public updatePurchaseInvoice(purchaseInvoice: string): Result<void> {
    this.props.purchaseInvoice = purchaseInvoice;
    return Result.ok<void>();
  }

  get vat(): boolean {
    return this.props.vat;
  }
  public updateVat(vat: boolean): Result<void> {
    this.props.vat = vat;
    return Result.ok<void>();
  }

  get vatDetails(): string {
    return this.props.vatDetails;
  }
  public updateVatDetails(vatDetails: string): Result<void> {
    this.props.vatDetails = vatDetails;
    return Result.ok<void>();
  }

  get imported(): boolean {
    return this.props.imported;
  }
  public updateImported(imported: boolean): Result<void> {
    this.props.imported = imported;
    return Result.ok<void>();
  }
  // --HISTORY

  // SERVICING
  get servicingHistory(): string {
    return this.props.servicingHistory;
  }
  public updateServicingHistory(servicingHistory: string): Result<void> {
    this.props.servicingHistory = servicingHistory;
    return Result.ok<void>();
  }

  get servicingInBrandNetwork(): boolean {
    return this.props.servicingInBrandNetwork;
  }
  public updateServicingInBrandNetwork(
    servicingInBrandNetwork: boolean,
  ): Result<void> {
    this.props.servicingInBrandNetwork = servicingInBrandNetwork;
    return Result.ok<void>();
  }

  get servicingManualPicture(): string {
    return this.props.servicingManualPicture;
  }
  public updateServicingManualPicture(
    servicingManualPicture: string,
  ): Result<void> {
    this.props.servicingManualPicture = servicingManualPicture;
    return Result.ok<void>();
  }

  get servicingInvoices(): boolean {
    return this.props.servicingInvoices;
  }
  public updateServicingInvoices(servicingInvoices: boolean): Result<void> {
    this.props.servicingInvoices = servicingInvoices;
    return Result.ok<void>();
  }

  get lastServicingDate(): string {
    return this.props.lastServicingDate;
  }
  public updateLastServicingDate(lastServicingDate: string): Result<void> {
    this.props.lastServicingDate = lastServicingDate;
    return Result.ok<void>();
  }

  get lastServicingKm(): number {
    return this.props.lastServicingKm;
  }
  public updateLastServicingKm(lastServicingKm: number): Result<void> {
    this.props.lastServicingKm = lastServicingKm;
    return Result.ok<void>();
  }

  get distributionBelt(): string {
    return this.props.distributionBelt;
  }
  public updateDistributionBelt(distributionBelt: string): Result<void> {
    this.props.distributionBelt = distributionBelt;
    return Result.ok<void>();
  }

  get nextTechnicalCheckDate(): string {
    return this.props.nextTechnicalCheckDate;
  }
  public updateNextTechnicalCheckDate(
    nextTechnicalCheckDate: string,
  ): Result<void> {
    this.props.nextTechnicalCheckDate = nextTechnicalCheckDate;
    return Result.ok<void>();
  }
  // --SERVICING

  //FREVO

  get reconditioningCostsMerchant(): number {
    return this.props.reconditioningCostsMerchant;
  }

  public updateReconditioningCostsMerchant(
    reconditioningCostsMerchant: number,
  ): Result<void> {
    this.props.reconditioningCostsMerchant = reconditioningCostsMerchant;
    return Result.ok<void>();
  }

  //MARKET
  get b2cMarketValue(): number {
    return this.props.b2cMarketValue;
  }
  public updateB2cMarketValue(b2cMarketValue: number): Result<void> {
    this.props.b2cMarketValue = b2cMarketValue;
    return Result.ok<void>();
  }

  get standardMileage(): number {
    return this.props.standardMileage;
  }
  public updateStandardMileage(standardMileage: number): Result<void> {
    this.props.standardMileage = standardMileage;
    return Result.ok<void>();
  }

  get dpaProAmt(): number {
    return this.props.dpaProAmt;
  }
  public updateDpaProAmt(dpaProAmt: number): Result<void> {
    this.props.dpaProAmt = dpaProAmt;
    return Result.ok<void>();
  }

  get salesSpeedName(): string {
    return this.props.salesSpeedName;
  }
  public updateSalesSpeedName(salesSpeedName: string): Result<void> {
    this.props.salesSpeedName = salesSpeedName;
    return Result.ok<void>();
  }

  get marketLink(): string {
    return this.props.marketLink;
  }
  public updateMarketLink(value: string): Result<void> {
    this.props.marketLink = value;
    return Result.ok<void>();
  }
  get marketDataDate(): Date {
    return this.props.marketDataDate;
  }
  // -- MARKET

  // LOGGING
  get userId(): string {
    return this.props.userId;
  }
  public updateuserId(userId: string): Result<void> {
    this.props.userId = userId;
    return Result.ok<void>();
  }

  get deletedBy(): string {
    return this.props.deletedBy;
  }
  public updatedeletedBy(deletedBy: string): Result<void> {
    this.props.deletedBy = deletedBy;
    return Result.ok<void>();
  }

  get updatedBy(): string {
    return this.props.updatedBy;
  }
  public updateUpdatedBy(updatedBy: string): Result<void> {
    this.props.updatedBy = updatedBy;
    return Result.ok<void>();
  }

  get createdBy(): string {
    return this.props.createdBy;
  }
  public updateCreatedBy(createdBy: string): Result<void> {
    this.props.createdBy = createdBy;
    return Result.ok<void>();
  }
  // -- LOGGING
  get createdAt(): Date {
    return this.props.createdAt;
  }
  // -- SUPERVISOR
  get entryStockDate(): Date {
    return this.props.entryStockDate;
  }

  public updateEntryStockDate(entryStockDate: Date): Result<void> {
    this.props.entryStockDate = entryStockDate;
    return Result.ok<void>();
  }

  get thumbnail(): string {
    return this.props.thumbnail;
  }

  public updateThumbnail(value: string): Result<void> {
    this.props.thumbnail = value;
    return Result.ok<void>();
  }

  // -- SUPERVISOR

  public static create(props: VehicleProps, id?: number): Result<Vehicle> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.fileNumber, argumentName: 'fileNumber' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Vehicle>(guardResult.message);
    }

    const vehicle = new Vehicle(
      {
        ...props,
      },
      id,
    );

    return Result.ok<Vehicle>(vehicle);
  }
}
