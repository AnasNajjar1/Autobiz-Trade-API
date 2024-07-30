import { de, en, es, fr, it, pt, nl } from '../../shared/translations';
// import moment from 'moment';

const dicts = {
  de,
  uk: en,
  es,
  fr,
  it,
  nl,
  pt,
  en,
  default: fr,
};

export function t(lang, code, variables = null) {
  lang = lang && lang.toLowerCase();
  const dict = getDict(lang);
  const translation = dict[code];

  if (!translation) {
    return code;
  }

  const translated_string = replaceVarInTranslatedString(dict[code], variables);

  return translated_string;
}

function getDict(lang) {
  lang = lang && lang.toLowerCase();
  if (dicts[lang]) {
    return dicts[lang];
  }

  return dicts.default;
}

function replaceVarInTranslatedString(translated_string, props) {
  const regex = /%{(\S+?)\}/g;
  const matches = translated_string.match(regex);

  if (matches !== null) {
    let propsName = '';
    matches.forEach((element) => {
      propsName = element.replace('%{', '').replace('}', '');
      if (props !== null && propsName in props)
        translated_string = translated_string.replace(
          element,
          props[propsName],
        );
    });
  }
  return translated_string;
}

// export function translateDate(date, format) {
//   return moment(date).format(t(format));
// }
