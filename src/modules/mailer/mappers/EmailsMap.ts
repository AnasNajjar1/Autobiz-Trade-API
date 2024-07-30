import { Mapper } from '../../../core/infra/Mapper';
// import { ISaleNotifInfos } from '../useCases/notifyNewSales/NotifyNewSalesUseCase';
import { t } from '../../../infra/deprecated/translate-lib';
import {
  EndOfSaleNotificationDto,
  AssignedWinnerSaleNotificationDto,
} from '../../catalog/dtos/saleDto';
import { RegisterDto } from '../../auth/useCases/register/RegisterDto';
import moment from 'moment-timezone';
export class EmailsMap implements Mapper<any> {
  public static toSubjectNewVehicle(language: string): string {
    return t(language, `subject_newVehicles`);
  }

  public static toContentNewVehicle(salesNotif, language: string): string {
    const sales = salesNotif.map(
      (s) =>
        `
    <tr>
      <td width="150"><img width="150" src="${s.carPicture}"/></td>
      <td>${s.fileNumber}</td>
      <td>${s.brandLabel}</td>
      <td>${s.modelLabel}</td>
      <td>${s.versionLabel}</td>
      <td>${s.mileage ? s.mileage.toLocaleString('fr-FR') : s.mileage}</td>
      <td>${s.pointofsaleName}</td>
      <td><a href="${process.env.siteUrl}/records/${s.uuid}">${t(
          language,
          'link',
        )}</a></td>
        </tr>`,
    );
    const html = sales.join('');
    const salesTable = `
    <style>
      table {
        border-collapse: collapse;
      }
      table, th, td {
        border: 1px solid;
        border-width: thin;
      }
      th, td {
        padding: 5px;
      }
      img {
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    </style>
    <table>
      <thead>
        <tr>
          <th>${t(language, 'carPicture')}</th>
          <th>${t(language, 'fileNumber')}</th>
          <th>${t(language, 'make')}</th>
          <th>${t(language, 'model')}</th>
          <th>${t(language, 'version')}</th>
          <th>${t(language, 'mileage')}</th>
          <th>${t(language, 'pointOfSale')}</th>
          <th>${t(language, 'link')}</th>
        </tr>
      </thead>
      <tbody>
      ${html}
      </tbody>
    </table>
    `;
    return t(language, 'body_newVehicles', { vehicles: salesTable });
  }

  public static toSubjectWinnerSale(sale: EndOfSaleNotificationDto, language) {
    return t(language, 'subject_winnerAuction', sale);
  }
  public static toContentWinnerSale(sale: EndOfSaleNotificationDto, language) {
    sale.offerCreatedAt = this.formatOfferDate(sale.offerCreatedAt, language);
    return t(language, 'body_winnerAuction', sale);
  }

  public static toSubjectLooserSale(sale: EndOfSaleNotificationDto, language) {
    return t(language, 'subject_looserAuction', sale);
  }
  public static toContentLooserSale(sale: EndOfSaleNotificationDto, language) {
    return t(language, 'body_looserAuction', sale);
  }

  public static toContentConnexion(user, language) {
    return `
    Nouvelle connexion de :${user.firstname} ${user.lastname}
    userId : ${user.userId} - email : ${user.email}
    `;
  }

  public static toSubjectConnexion(user, language) {
    return `
    Nouvelle connexion sur autobizTrade de :${user.firstname} ${user.lastname}
    `;
  }

  public static toSubjectRegister(language: string): string {
    return t(language, 'subject_register');
  }

  public static toContentRegister(dto: RegisterDto): string {
    const language = dto.language;
    return `
    <h1>${t(language, 'companyForm')}</h1>
    <table>
      <tbody>          
        <tr>
          <td> ${t(language, 'companyNameForm')} : </td>
          <td>${dto.companyName}</td>
        </tr>
        <tr>
          <td> ${t(language, 'vatForm')} : </td>
          <td>${dto.vat}</td>
        </tr>
        <tr>
          <td> ${t(language, 'companyNumberForm')} : </td>
          <td>${dto.companyNumber}</td>
        </tr>
        <tr>
          <td> ${t(language, 'companyAddressForm')} : </td>
          <td>${dto.companyAddress}</td>
        </tr>
        <tr>
          <td> ${t(language, 'companyAddressAdditionForm')} : </td>
          <td>${dto.companyAddressAddition || ''}</td>
        </tr>
        <tr>
          <td> ${t(language, 'companyZipForm')} : </td>
          <td>${dto.companyZip}</td>
        </tr>
        <tr>
          <td> ${t(language, 'companyCityForm')} : </td>
          <td>${dto.companyCity}</td>
        </tr>
        <tr>
          <td> ${t(language, 'companyCountryForm')} : </td>
          <td>${dto.companyCountry}</td>
        </tr>
      </tbody>
    </table>
    <h1>${t(language, 'contactForm')}</h1>
    <table>
      <tbody>                    
        <tr>
          <td> ${t(language, 'civilityForm')} : </td>
          <td>${dto.civility}</td>
        </tr>
        <tr>
          <td> ${t(language, 'firstNameForm')} : </td>
          <td>${dto.firstName}</td>
        </tr>
        <tr>
          <td> ${t(language, 'lastNameForm')} : </td>
          <td>${dto.lastName}</td>
        </tr>
        <tr>
          <td> ${t(language, 'roleForm')} : </td>
          <td>${dto.role}</td>
        </tr>
        <tr>
          <td> ${t(language, 'phoneNumberForm')} : </td>
          <td>${dto.phoneNumber}</td>
        </tr>
        <tr>
          <td> ${t(language, 'emailForm')} : </td>
          <td>${dto.email}</td>
        </tr>      
      </tbody>
    </table>`;
  }
  public static toSubjectAssignedWinnerSale(language: string): string {
    return t(language, 'subject_winnerOfferToPrivate');
  }
  public static toContentAssignedWinnerSale(
    sale: AssignedWinnerSaleNotificationDto,
    language: string,
  ): string {
    sale.offerCreatedAt = this.formatOfferDate(sale.offerCreatedAt, language);
    return t(language, 'body_winnerOfferToPrivate', sale);
  }

  public static formatOfferDate(
    offerCreatedAt: string,
    language: string = 'fr',
  ): string {
    const dateTimeZone = moment.tz.zonesForCountry(language.toUpperCase());
    const dateTimeFormat = 'DD/MM/YYYY HH:mm';
    const dateToConvert = moment(offerCreatedAt);
    offerCreatedAt = dateToConvert.format(dateTimeFormat);
    if (dateTimeZone.length > 0)
      offerCreatedAt = dateToConvert.tz(dateTimeZone[0]).format(dateTimeFormat);
    return offerCreatedAt;
  }
}
