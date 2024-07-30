export interface Documentation {
  title?: String;
  pdf: String;
  text?: String;
}

export interface PointofsaleAdminFullDto {
  id?: number;
  uuid?: string;
  autobizPosId: string;
  city: string;
  comments?: string;
  country: string;
  documentation?: Documentation[];
  info?: string;
  latitude: number;
  longitude: number;
  name: string;
  paymentDeadline?: string;
  pickupDeadline?: string;
  picture?: string;
  zipCode: string;
  company?: string;
}

export interface PointofsaleAdminShortDto {
  id: number;
  name: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface BrandsOnline {
  brandLabel: string;
  countVehicle: number;
}

export interface PointofsalePublicFullDto {
  uuid: string;
  name: string;
  picture: string;
  info: string;
  comments: string;
  paymentDeadline: string;
  pickupDeadline: string;
  documentation: Documentation[];
  zipCode: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  brandsOnline?: BrandsOnline[];
  isBookmarkedByUser: boolean;
  countVehicles: number;
  company: string;
  commentsInt: string;
  paymentDeadlineInt: string;
  pickupDeadlineInt: string;
}

export interface PointofsalePublicShortDto {
  uuid: string;
  name: string;
  picture?: string;
  zipCode: string;
  city: string;
  country: string;
  isBookmarkedByUser: boolean;
  countVehicles: number;
  brandsOnline?: BrandsOnline[];
}
