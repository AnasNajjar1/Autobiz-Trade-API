import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';
import { PointofsaleDocumentation } from './pointofsaleDocumentation';
import { PointofsalePicture } from './pointofsalePicture';
import { PointofsaleCountry } from './pointofsaleCountry';
import { PointofsaleLatitude } from './pointofsaleLatitude';
import { PointofsaleLongitude } from './pointofsaleLongitude';
import { BrandsOnline } from '../dtos/pointofsaleDto';
import { Vehicle } from '../../catalog/domain/vehicle';

export interface PointofsaleProps {
  id?: number;
  uuid?: string;
  autobizPosId: string;
  city: string;
  comments?: string;
  country: PointofsaleCountry;
  documentation?: PointofsaleDocumentation;
  info?: string;
  latitude: PointofsaleLatitude;
  longitude: PointofsaleLongitude;
  name: string;
  paymentDeadline?: string;
  pickupDeadline?: string;
  picture?: PointofsalePicture;
  zipCode: string;
  brandsOnline?: BrandsOnline[];
  isBookmarkedByUser?: boolean;
  countVehicles?: number;
  company?: string;
  commentsInt?: string;
  paymentDeadlineInt?: string;
  pickupDeadlineInt?: string;
}

export class Pointofsale extends AggregateRoot<PointofsaleProps> {
  constructor(props: PointofsaleProps, id?: number) {
    super(props, id);
    if (!id) {
      props.uuid = uuidv4();
    }
  }

  get uuid(): string {
    return this.props.uuid;
  }

  get autobizPosId(): string {
    return this.props.autobizPosId;
  }

  public updateAutobizPosId(autobizPosId: string): Result<void> {
    this.props.autobizPosId = autobizPosId;
    return Result.ok<void>();
  }

  get city(): string {
    return this.props.city;
  }

  public updateCity(city: string): Result<void> {
    this.props.city = city;
    return Result.ok<void>();
  }

  get comments(): string {
    return this.props.comments;
  }

  public updateComments(comments: string): Result<void> {
    this.props.comments = comments;
    return Result.ok<void>();
  }
  get commentsInt(): string {
    return this.props.commentsInt;
  }

  public updateCommentsInt(commentsInt: string): Result<void> {
    this.props.commentsInt = commentsInt;
    return Result.ok<void>();
  }

  get country(): PointofsaleCountry {
    return this.props.country;
  }

  public updateCountry(country: PointofsaleCountry): Result<void> {
    this.props.country = country;
    return Result.ok<void>();
  }

  get documentation(): PointofsaleDocumentation {
    return this.props.documentation;
  }

  public updateDocumentation(
    documentation: PointofsaleDocumentation,
  ): Result<void> {
    this.props.documentation = documentation;
    return Result.ok<void>();
  }

  get info(): string {
    return this.props.info;
  }

  public updateInfo(info: string): Result<void> {
    this.props.info = info;
    return Result.ok<void>();
  }

  get latitude(): PointofsaleLatitude {
    return this.props.latitude;
  }

  public updateLatitude(latitude: PointofsaleLatitude): Result<void> {
    this.props.latitude = latitude;
    return Result.ok<void>();
  }

  get longitude(): PointofsaleLongitude {
    return this.props.longitude;
  }

  public updateLongitude(longitude: PointofsaleLongitude): Result<void> {
    this.props.longitude = longitude;
    return Result.ok<void>();
  }

  get name(): string {
    return this.props.name;
  }

  public updateName(name: string): Result<void> {
    this.props.name = name;
    return Result.ok<void>();
  }

  get paymentDeadline(): string {
    return this.props.paymentDeadline;
  }

  public updatePaymentDeadline(paymentDeadline: string): Result<void> {
    this.props.paymentDeadline = paymentDeadline;
    return Result.ok<void>();
  }

  get paymentDeadlineInt(): string {
    return this.props.paymentDeadlineInt;
  }

  public updatePaymentDeadlineInt(paymentDeadlineInt: string): Result<void> {
    this.props.paymentDeadlineInt = paymentDeadlineInt;
    return Result.ok<void>();
  }

  get pickupDeadline(): string {
    return this.props.pickupDeadline;
  }

  public updatePickupDeadline(pickupDeadline: string): Result<void> {
    this.props.pickupDeadline = pickupDeadline;
    return Result.ok<void>();
  }

  get pickupDeadlineInt(): string {
    return this.props.pickupDeadlineInt;
  }

  public updatePickupDeadlineInt(pickupDeadlineInt: string): Result<void> {
    this.props.pickupDeadlineInt = pickupDeadlineInt;
    return Result.ok<void>();
  }

  get picture(): PointofsalePicture {
    return this.props.picture;
  }

  public updatePicture(picture: PointofsalePicture): Result<void> {
    this.props.picture = picture;
    return Result.ok<void>();
  }

  get zipCode(): string {
    return this.props.zipCode;
  }

  public updateZipCode(zipCode: string): Result<void> {
    this.props.zipCode = zipCode;
    return Result.ok<void>();
  }

  get company(): string {
    return this.props.company;
  }

  public updateCompany(company: string): Result<void> {
    this.props.company = company;
    return Result.ok<void>();
  }

  get brandsOnline(): BrandsOnline[] {
    return this.props.brandsOnline;
  }

  get isBookmarkedByUser(): boolean {
    return this.props.isBookmarkedByUser;
  }

  get countVehicles(): number {
    return this.props.countVehicles;
  }

  public static create(
    props: PointofsaleProps,
    id?: number,
  ): Result<Pointofsale> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Pointofsale>(guardResult.message);
    }

    const pointofsale = new Pointofsale(
      {
        ...props,
      },
      id,
    );

    return Result.ok<Pointofsale>(pointofsale);
  }
}
