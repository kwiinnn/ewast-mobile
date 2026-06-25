// constants/translations.ts

type Language = 'english' | 'bisaya';

export const t = (key: string, lang: Language): string =>
  translations[key]?.[lang] ?? translations[key]?.['english'] ?? key;

const translations: Record<string, Record<Language, string>> = {
    // INDEX
  // Guest view
  'home.guest.headline1':   { english: 'Be Part of the',              bisaya: 'Tabangay sa' },
  'home.guest.headline2':   { english: 'Local',                       bisaya: 'Lokal nga' },
  'home.guest.headline3':   { english: 'Waste Collection',            bisaya: 'Pangolekta ug Basura' },
  'home.guest.subtitle':    { english: 'Get information about garbage collection and report scattered garbage around your area.', bisaya: 'Subaybaya ang pagpangolektag basura ug i-report ang nagkatag nga basura sa inyong lugar.' },
  'home.guest.login':       { english: 'Login now!',                  bisaya: 'Login na!' },
  'home.guest.schedules':   { english: 'Schedules',                   bisaya: 'Iskedyul' },
  'home.guest.data':        { english: 'Data',                        bisaya: 'Datos' },
  'home.guest.report':      { english: 'Report',                      bisaya: 'I-report' },

  // Logged-in view
  'home.track.headline1':   { english: 'Track Your Local',            bisaya: 'Subaybaya ang Lokal nga' },
  'home.track.headline2':   { english: 'Waste',                       bisaya: 'Pangolekta ug' },
  'home.track.headline3':   { english: 'Collection',                  bisaya: 'Basura' },
  'home.track.subtitle':    { english: 'Stay updated with live garbage truck locations and collection schedules', bisaya: 'Pamati sa live nga lokasyon sa garbage truck ug mga iskedyul sa koleksyon' },
  'home.track.search':      { english: 'Search Location',             bisaya: 'Pangita og Lokasyon' },
  'home.track.live':        { english: 'Track Live',                  bisaya: 'Sunda Live' },
  'home.track.schedules':   { english: 'Schedules',                   bisaya: 'Iskedyul' },
  'home.track.heatmap':     { english: 'Heatmap',                     bisaya: 'Heatmap' },

  // PROFILE
  'profile.reports': { english: 'Reports',            bisaya: 'Nareport' },
  'profile.resolved': { english: 'Resolved',            bisaya: 'Nasulbad' },
  'profile.pending': { english: 'Pending',            bisaya: 'Ginahuwat' },
  'profile.language': { english: 'LANGUAGE',            bisaya: 'LINGGWAHE' },
  'profile.select': { english: 'Search Location',            bisaya: 'Pangitag Lugar' },
  'profile.all': { english: 'All',            bisaya: 'Tanan' },

  //REPORT
  'report.headline1': { english: 'Report an Issue',            bisaya: 'Ireklamo ang Isyu' },
  'report.headline2': { english: 'Tap to submit a new garbage report in your area',            bisaya: 'Pindota aron makareklamo sa mga panghugaw sa inyong lugar' },
  'report.view': { english: 'View All',            bisaya: 'Tan-awa Tanan' },
  'report.button1': { english: 'Report Now',            bisaya: 'Ireport' },
  'report.announcements': { english: 'Announcements',            bisaya: 'Mga Anunsyo' },
  'report.return': { english: 'Back to Dashboard',            bisaya: 'Balik sa Dashboard' },
  'report.select': { english: 'Select Issue Type',            bisaya: 'Pamili ug Ipanghisgut' },
  'report.details': { english: 'Report Details',            bisaya: 'Detalye sa Pangreklamo' },
  'report.describe': { english: 'Describe the Issue',            bisaya: 'Ihulagway ang Isyu' },
  'report.location': { english: 'Location',            bisaya: 'Lokasyon' },
  'report.type': { english: 'Type of Report',            bisaya: 'Ginahisgut sa Reklamo' },
  'report.description': { english: 'Description',            bisaya: 'Deskripsyon' },
  'report.note': { 
    english: 'By submitting this form, you consent to the collection, processing, and storage of your report solely for the purposes of recording and analysis by CENRO in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).',            
    bisaya: 'Pinaagi sa pagsumite niini nga porma, naghatag ka og pagtugot sa pagkolekta, pagproseso, ug pagtipig sa imong report alang lamang sa katuyoan sa pagrekord ug pag-analisar sa CENRO, subay sa Data Privacy Act of 2012 (Republic Act No. 10173).' },
  'report.submit': { english: 'SUBMIT REPORT',            bisaya: 'IPASA' },
  'report.submitting': { english: 'SUBMITTING...',            bisaya: 'GINAPASA...' },
  'report.read': { english: 'Read More',            bisaya: 'Basaha' },
  'report.status': { english: 'Report submitted successfully!',            bisaya: 'Napasa na!' },

  //NOTIFS
  'notif.head': { english: 'Notifications',            bisaya: 'Notipikasyon' },
  'notif.subhead': { english: 'Updates on the reports you\'ve submitted',            bisaya: 'Pamati sa mga reklamong imong napasa' },
};