import fetchDictionary from './fetch-dictionary';

export const fetchTradeNames = fetchDictionary('/tradeName');
export const fetchInternationalNames = fetchDictionary('/internationalName');
export const fetchDosageForms = fetchDictionary('/dosageForm');
export const fetchDosages = fetchDictionary('/dosage');
export const fetchPackings = fetchDictionary('/packing');
export const fetchPackagings = fetchDictionary('/packaging');
export const fetchCountries = fetchDictionary('/country');
export const fetchManufacturers = fetchDictionary('/manufacturer');
export const fetchMeasurementUnits = fetchDictionary('/measurementUnit');
export const fetchTaxRates = fetchDictionary('/taxRate');
export const fetchMedicationTypes = fetchDictionary('/medicationType');
