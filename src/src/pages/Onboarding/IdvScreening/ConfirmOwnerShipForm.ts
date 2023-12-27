// import { formatCountriesListForOptionSet } from "../../../config/transformer";
// import { store } from "../../../redux/store";

// const state = store.getState();
// const { countries } = state.countries;
// const { selectedCountryStates, documentTypes } = state.idvScreening

export const documentsPublisherEvents = {
  mounted: "VDDocument_mounted",
  mountFailure: "VDDocument_mountFailure",
  cameraFailure: "VDDocument_cameraFailure",
  cameraStarted: "VDDocument_cameraStarted",
  unmounted: "VDDocument_unmounted",
  obverseDetection: "VDDocument_obverseDetection",
  reverseDetection: "VDDocument_reverseDetection",
  detectionTimeout: "VDDocument_detectionTimeout"
};

export const selfiePublisherEvents = {
  mounted: "VDAlive_mounted",
  cameraStarted: "VDAlive_cameraStarted",
  mountFailure: "VDAlive_mountFailure",
  cameraFailure: "VDAlive_cameraFailure",
  unmounted: "VDAlive_unmounted",
  faceDetection: "VDAlive_faceDetection",
  smileDetection: "VDAlive_smileDetection",
  detectionTimeout: "VDAlive_detectionTimeout",
  repeatClicked: "VDAlive_repeatClicked",
  continueClicked: "VDAlive_continueClicked",
  countdownFinished: "VDAlive_countdownFinished"
};

export const countryDocuments = [
  {
    country: "Afghanistan",
    documents: [{ type: "Passport", name: "AF_Passport", code: "AF" }]
  },
  {
    country: "Andorra",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_1990",
        code: "AD_DL"
      },
      { type: "Passport", name: "AD_Passport", code: "AD" }
    ]
  },
  {
    country: "Albania",
    documents: [
      { type: "ID Card", name: "AL_IDCard_2009", code: "AL_ID" },
      { type: "Passport", name: "AL_Passport", code: "AL" }
    ]
  },
  {
    country: "Algeria",
    documents: [{ type: "Passport", name: "DZ_Passport", code: "DZ" }]
  },
  {
    country: "Armenia",
    documents: [{ type: "Passport", name: "AM_Passport", code: "AM" }]
  },

  {
    country: "Argentina",
    documents: [
      { type: "ID Card", name: "AR_IDCard_2012", code: "AR2_ID" },
      { type: "Passport", name: "AR_Passport", code: "A=R" }
    ]
  },
  {
    country: "Australia",
    state: "Australian Capital Territory",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_2011",
        code: "AU_DL"
      },
      { type: "Passport", name: "AU_Passport", code: "AU" }
    ]
  },
  {
    country: "Australia",
    state: "New South Wales",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_2013",
        code: "AU_DL"
      },
      { type: "Passport", name: "AU_Passport", code: "AU" }
    ]
  },
  {
    country: "Australia",
    state: "Northern Territory",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_2006",
        code: "AU_DL"
      },
      { type: "Passport", name: "AU_Passport", code: "AU" }
    ]
  },
  {
    country: "Australia",
    state: "Queensland",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_2016",
        code: "AU_DL"
      },
      { type: "Passport", name: "AU_Passport", code: "AU" }
    ]
  },
  {
    country: "Australia",
    state: "South Australia",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_2014",
        code: "AU_DL"
      },
      { type: "Passport", name: "AU_Passport", code: "AU" }
    ]
  },
  {
    country: "Australia",
    state: "Tasmania",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_2015",
        code: "AU_DL"
      },
      { type: "Passport", name: "AU_Passport", code: "AU" }
    ]
  },
  {
    country: "Australia",
    state: "Victoria",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_2009",
        code: "AU_DL"
      },
      { type: "Passport", name: "AU_Passport", code: "AU" }
    ]
  },
  {
    country: "Australia",
    state: "Western Australia",
    documents: [
      {
        type: "Driving License",
        name: "AD_DrivingLicense_2014",
        code: "AU_DL"
      },
      { type: "Passport", name: "AU_Passport", code: "AU" }
    ]
  },
  {
    country: "Austria",
    documents: [
      {
        type: "Driving License",
        name: "AT_DrivingLicense_2014",
        code: "AT_DL"
      },
      { type: "ID Card", name: "AT_IDCard_2010", code: "AT_ID" },
      {
        type: "Residence Permit",
        name: "AT_ResidencePermit_2011",
        code: "AT_ID"
      }
    ]
  },
  {
    country: "Azerbaijan",
    documents: [{ type: "Passport", name: "AZ_Passport", code: "AZ" }]
  },
  {
    country: "Bahamas",
    documents: [{ type: "Passport", name: "BS_Passport", code: "BS" }]
  },
  {
    country: "Bahrain",
    documents: [{ type: "Passport", name: "BH_Passport", code: "BH" }]
  },
  {
    country: "Bangladesh",
    documents: [{ type: "Passport", name: "BD_Passport", code: "BD" }]
  },
  {
    country: "Barbados",
    documents: [{ type: "Passport", name: "BB_Passport", code: "BB" }]
  },
  {
    country: "Belgium",
    documents: [
      {
        type: "Driving License",
        name: "BE_DrivingLicense_2010",
        code: "BE_DL"
      },
      { type: "ID Card", name: "BE_IDCard_2013", code: "BE_ID" },
      { type: "Passport", name: "BE_Passport", code: "BE" }
    ]
  },
  {
    country: "Brazil",
    documents: [
      { type: "Driving License", name: "BR_IDCard_2014", code: "BR_ID" },
      { type: "ID Card", name: "BR_IDCard_2019", code: "BR_ID" },
      { type: "Passport", name: "BR_Passport", code: "BR" }
    ]
  },
  {
    country: "Bulgaria",
    documents: [
      {
        type: "Driving License",
        name: "BG_DrivingLicense_2013",
        code: "BG_DL"
      },
      { type: "ID Card", name: "BG_IDCard_2010", code: "BG_ID" },
      { type: "Passport", name: "BG_Passport", code: "BG" }
    ]
  },
  {
    country: "Belarus",
    documents: [
      {
        type: "Driving License",
        name: "BY_DrivingLicense_2010",
        code: "BY_DL"
      },
      { type: "Passport", name: "BY_Passport", code: "BY" }
    ]
  },
  {
    country: "Belize",
    documents: [{ type: "Passport", name: "BZ_Passport", code: "BZ" }]
  },
  {
    country: "Bolivia",
    documents: [{ type: "Passport", name: "BO_Passport", code: "BO" }]
  },
  {
    country: "Botswana",
    documents: [{ type: "Passport", name: "BW_Passport", code: "BW" }]
  },
  {
    country: "Brunei Darussalam",
    documents: [{ type: "Passport", name: "BN_Passport", code: "BN" }]
  },
  {
    country: "Burkina Faso",
    documents: [{ type: "Passport", name: "BF_Passport", code: "BF" }]
  },
  {
    country: "Burundi",
    documents: [{ type: "Passport", name: "BI_Passport", code: "BI" }]
  },
  {
    country: "Cambodia",
    documents: [{ type: "Passport", name: "KH_Passport", code: "KH" }]
  },
  {
    country: "Cameroon",
    documents: [{ type: "Passport", name: "CM_Passport", code: "CM" }]
  },
  {
    country: "Ivory Coast (Cote d'Ivoire)",
    documents: [{ type: "Passport", name: "CI_Passport", code: "CI" }]
  },
  {
    country: "Switzerland",
    documents: [
      {
        type: "Driving License",
        name: "CH_DrivingLicense_2003",
        code: "CH_DL"
      },
      { type: "ID Card", name: "CH_IDCard_2003", code: "CH_ID" },
      { type: "Passport", name: "CH_Passport", code: "CH" }
    ]
  },
  {
    country: "Syria",
    documents: [{ type: "Passport", name: "CY_Passport", code: "CY" }]
  },
  {
    country: "Chile",
    documents: [
      { type: "ID Card", name: "CL_IDCard_2013", code: "CL_ID" },
      { type: "Passport", name: "CL_Passport", code: "CL" }
    ]
  },
  {
    country: "China",
    documents: [
      { type: "ID Card", name: "CN_IDCard_2004", code: "CN_ID" },
      { type: "Passport", name: "CN_Passport", code: "CN" }
    ]
  },
  {
    country: "Comoros",
    documents: [{ type: "Passport", name: "KM_Passport", code: "KM" }]
  },
  {
    country: "Congo, Republic",
    documents: [{ type: "Passport", name: "CD_Passport", code: "CD" }]
  },
  {
    country: "Congo, Democratic Republic",
    documents: [{ type: "Passport", name: "CD_Passport", code: "CD" }]
  },
  {
    country: "Colombia",
    documents: [
      { type: "ID Card", name: "CO_IDCard_2000", code: "CO_ID" },
      {
        type: "Residence Permit",
        name: "CO_ResidencePermit_2016",
        code: "CO_ID"
      },
      { type: "Passport", name: "CO_Passport", code: "CO" }
    ]
  },
  {
    country: "Croatia",
    documents: [
      {
        type: "Driving License",
        name: "HR_DrivingLicense_2013",
        code: "HR_DL"
      },
      { type: "ID Card", name: "HR_IDCard_2015", code: "HR_ID" },
      { type: "Passport", name: "HR_Passport", code: "HR" }
    ]
  },
  {
    country: "Cuba",
    documents: [{ type: "Passport", name: "CU_Passport", code: "CU" }]
  },
  {
    country: "Cyprus",
    documents: [
      {
        type: "Driving License",
        name: "CY_DrivingLicense_2015",
        code: "CY_DL"
      },
      { type: "ID Card", name: "CY_IDCard_2015", code: "CY_ID" },
      { type: "Passport", name: "CY_Passport", code: "CY" }
    ]
  },
  {
    country: "Taiwan",
    documents: [{ type: "Passport", name: "TW_Passport", code: "TW" }]
  },
  {
    country: "Tajikistan",
    documents: [{ type: "Passport", name: "TJ_Passport", code: "TJ" }]
  },
  {
    country: "Tanzania",
    documents: [{ type: "Passport", name: "TZ_Passport", code: "TZ" }]
  },
  {
    country: "Thailand",
    documents: [{ type: "Passport", name: "TH_Passport", code: "TH" }]
  },
  {
    country: "Togo",
    documents: [{ type: "Passport", name: "TG_Passport", code: "TG" }]
  },
  {
    country: "Tunisia",
    documents: [{ type: "Passport", name: "TN_Passport", code: "TN" }]
  },
  {
    country: "Turkmenistan",
    documents: [{ type: "Passport", name: "TM_Passport", code: "TM" }]
  },
  {
    country: "Czechia",
    documents: [
      {
        type: "Driving License",
        name: "CZ_DrivingLicense_2013",
        code: "CZ_DL"
      },
      { type: "ID Card", name: "CZ_IDCard_2014", code: "CZ_ID" },
      { type: "Passport", name: "CZ_Passport", code: "CZ" }
    ]
  },
  {
    country: "Germany",
    documents: [
      {
        type: "Driving License",
        name: "DE_DrivingLicense_2013",
        code: "DE_DL"
      },
      { type: "ID Card", name: "DE_IDCard_2010", code: "DE_ID" },
      { type: "Passport", name: "DE_Passport", code: "DE" }
    ]
  },
  {
    country: "Ghana",
    documents: [{ type: "Passport", name: "GH_Passport", code: "GH" }]
  },
  {
    country: "Djibouti",
    documents: [{ type: "Passport", name: "DJ_Passport", code: "DJ" }]
  },
  {
    country: "Denmark",
    documents: [
      {
        type: "Driving License",
        name: "DK_DrivingLicense_2013",
        code: "DK_DL"
      },
      { type: "Passport", name: "DK_Passport", code: "DK" }
    ]
  },
  {
    country: "Estonia",
    documents: [
      {
        type: "Driving License",
        name: "EE_DrivingLicense_2013",
        code: "EE_DL"
      },
      { type: "ID Card", name: "EE_IDCard_2011", code: "EE_ID" },
      { type: "Passport", name: "EE_Passport", code: "EE" }
    ]
  },
  {
    country: "Ecuador",
    documents: [{ type: "Passport", name: "EC_Passport", code: "EC" }]
  },
  {
    country: "Ethiopia",
    documents: [{ type: "Passport", name: "ET_Passport", code: "ET" }]
  },
  {
    country: "Egypt",
    documents: [{ type: "Passport", name: "EG_Passport", code: "EG" }]
  },
  {
    country: "El Salvador",
    documents: [{ type: "Passport", name: "SV_Passport", code: "SV" }]
  },
  {
    country: "Finland",
    documents: [
      {
        type: "Driving License",
        name: "FI_DrivingLicense_2013",
        code: "FI_DL"
      },
      { type: "ID Card", name: "FI_IDCard_2017", code: "FI_ID" },
      { type: "Passport", name: "FI_Passport", code: "FI" }
    ]
  },
  {
    country: "France",
    documents: [
      {
        type: "Driving License",
        name: "FR_DrivingLicense_2013",
        code: "FR_DL"
      },
      { type: "ID Card", name: "FR_IDCard_1994", code: "FI_ID" },
      { type: "Passport", name: "FR_Passport", code: "FR" }
    ]
  },
  {
    country: "France",
    documents: [{ type: "Passport", name: "GA_Passport", code: "GA" }]
  },
  {
    country: "United Kingdom",
    documents: [
      {
        type: "Driving License",
        name: "GB_DrivingLicense-PL_2015",
        code: "GB_DL"
      },
      { type: "Passport", name: "GB_Passport", code: "GB" }
    ]
  },
  {
    country: "Greece",
    documents: [
      {
        type: "Driving License",
        name: "GR_DrivingLicense_2013",
        code: "GR_DL"
      },
      { type: "Passport", name: "GR_Passport", code: "GR" }
    ]
  },
  {
    country: "Grenada",
    documents: [{ type: "Passport", name: "GD_Passport", code: "GD" }]
  },
  {
    country: "Greece",
    documents: [{ type: "Passport", name: "GR_Passport", code: "GR" }]
  },
  {
    country: "Guatemala",
    documents: [{ type: "ID Card", name: "GT_IDCard_2009", code: "GT_ID" }]
  },
  {
    country: "Guinea, Republic of",
    documents: [{ type: "Passport", name: "GN_Passport", code: "GN" }]
  },
  {
    country: "Guinea Bissau",
    documents: [{ type: "Passport", name: "GW_Passport", code: "GW" }]
  },
  {
    country: "Gambia",
    documents: [{ type: "Passport", name: "GM_Passport", code: "GM" }]
  },
  {
    country: "Georgia",
    documents: [
      { type: "Driving License", name: "GE_DrivingLicense_2010", code: "GE" }
    ]
  },
  {
    country: "Haiti",
    documents: [{ type: "Passport", name: "HT_Passport", code: "HT" }]
  },
  {
    country: "Honduras",
    documents: [{ type: "Passport", name: "HN_Passport", code: "HN" }]
  },
  {
    country: "Hungary",
    documents: [
      {
        type: "Driving License",
        name: "HU_DrivingLicense_2013",
        code: "HU_DL"
      },
      { type: "ID Card", name: "HU_IDCard_2015", code: "HU_ID" },
      { type: "Passport", name: "HU_Passport", code: "HU" }
    ]
  },
  {
    country: "Ireland",
    documents: [
      {
        type: "Driving License",
        name: "IE_DrivingLicense_2013",
        code: "IE_DL"
      },
      { type: "Passport", name: "IE_Passport_2015", code: "IE" }
    ]
  },
  {
    country: "Israel",
    documents: [{ type: "Passport", name: "IL_Passport_2015", code: "IL" }]
  },
  {
    country: "Mexico",
    documents: [
      { type: "ID Card", name: "MX_IDCard_2019", code: "MX_ID" },
      { type: "Passport", name: "MX_Passport", code: "MX" }
    ]
  },
  {
    country: "Iceland",
    documents: [
      {
        type: "Driving License",
        name: "IS_DrivingLicense_2013",
        code: "IS_DL"
      },
      { type: "Passport", name: "MX_Passport", code: "IS" }
    ]
  },
  {
    country: "Indonesia",
    documents: [{ type: "Passport", name: "ID_Passport", code: "ID" }]
  },
  {
    country: "Iran",
    documents: [{ type: "Passport", name: "IR_Passport", code: "IR" }]
  },
  {
    country: "Iraq",
    documents: [{ type: "Passport", name: "IQ_Passport", code: "IQ" }]
  },
  {
    country: "India",
    documents: [{ type: "Passport", name: "IN_Passport", code: "IN" }]
  },
  {
    country: "Italy",
    documents: [
      {
        type: "Driving License",
        name: "IT_DrivingLicense_2013",
        code: "IT_DL"
      },
      { type: "ID Card", name: "IT_IDCard_2016", code: "IT_ID" },
      { type: "Passport", name: "IT_Passport", code: "IT" }
    ]
  },
  {
    country: "Jamaica",
    documents: [{ type: "Passport", name: "JM_Passport", code: "JM" }]
  },
  {
    country: "Japan",
    documents: [{ type: "Passport", name: "JP_Passport", code: "JP" }]
  },
  {
    country: "Jordan",
    documents: [{ type: "Passport", name: "JO_Passport", code: "JO" }]
  },
  {
    country: "Kazakhstan",
    documents: [{ type: "Passport", name: "KZ_Passport", code: "KZ" }]
  },
  {
    country: "Kenya",
    documents: [{ type: "Passport", name: "KE_Passport", code: "KE" }]
  },
  {
    country: "Kuwait",
    documents: [{ type: "Passport", name: "KW_Passport", code: "KW" }]
  },
  {
    country: "Laos",
    documents: [{ type: "Passport", name: "KW_Passport", code: "KW" }]
  },
  {
    country: "Liechtenstein",
    documents: [
      {
        type: "Driving License",
        name: "LI_DrivingLicense_2003",
        code: "LI_DL"
      },
      { type: "ID Card", name: "LI_IDCard_2009", code: "LI_ID" },
      { type: "Passport", name: "LI_Passport", code: "LI" }
    ]
  },
  {
    country: "Lithuania",
    documents: [
      {
        type: "Driving License",
        name: "LT_DrivingLicense_2016",
        code: "LT_DL"
      },
      { type: "ID Card", name: "LT_IDCard_2009", code: "LT_ID" },
      { type: "Passport", name: "LT_Passport", code: "LT" }
    ]
  },
  {
    country: "Luxembourg",
    documents: [
      {
        type: "Driving License",
        name: "LU_DrivingLicense_2013",
        code: "LU_DL"
      },
      { type: "ID Card", name: "LU_IDCard_2014", code: "LU_ID" },
      { type: "Passport", name: "LU_Passport", code: "LU" }
    ]
  },
  {
    country: "Latvia",
    documents: [
      {
        type: "Driving License",
        name: "LV_DrivingLicense_2013",
        code: "LV_DL"
      },
      { type: "ID Card", name: "LV_IDCard_2012", code: "LV_ID" },
      { type: "Passport", name: "LV_Passport", code: "LV" }
    ]
  },
  {
    country: "Lesotho",
    documents: [{ type: "Passport", name: "LS_Passport", code: "LS" }]
  },
  {
    country: "Lebanon",
    documents: [{ type: "Passport", name: "LB_Passport", code: "LB" }]
  },
  {
    country: "Liberia",
    documents: [{ type: "Passport", name: "LR_Passport", code: "LR" }]
  },
  {
    country: "Libya",
    documents: [{ type: "Passport", name: "LY_Passport", code: "LY" }]
  },
  {
    country: "Madagascar",
    documents: [{ type: "Passport", name: "MG_Passport", code: "MG" }]
  },
  {
    country: "Monaco",
    documents: [
      { type: "ID Card", name: "MC_IDCard_2009", code: "MC_ID" },
      { type: "Passport", name: "MC_Passport", code: "MC" }
    ]
  },
  {
    country: "Mongolia",
    documents: [{ type: "Passport", name: "MN_Passport", code: "MN" }]
  },
  {
    country: "Moldavia",
    documents: [{ type: "ID Card", name: "MD_IDCard_2015", code: "MD_ID" }]
  },
  {
    country: "Montenegro",
    documents: [
      { type: "ID Card", name: "ME_IDCard_2008", code: "ME_ID" },
      { type: "Passport", name: "ME_Passport", code: "ME" }
    ]
  },
  {
    country: "Macedonia",
    documents: [
      { type: "ID Card", name: "MK_IDCard_2007", code: "MK_ID" },
      { type: "Passport", name: "MK_Passport", code: "MK" }
    ]
  },
  {
    country: "Morocco",
    documents: [{ type: "Passport", name: "MA_Passport", code: "MA" }]
  },
  {
    country: "Mozambique",
    documents: [{ type: "Passport", name: "MZ_Passport", code: "MZ" }]
  },
  {
    country: "Myanmar (Burma)",
    documents: [{ type: "Passport", name: "MM_Passport", code: "MM" }]
  },
  {
    country: "Malta",
    documents: [
      {
        type: "Driving License",
        name: "MT_DrivingLicense_2013",
        code: "MT_DL"
      },
      { type: "ID Card", name: "MT_IDCard_2014", code: "MT_ID" },
      { type: "Passport", name: "MT_Passport", code: "MT" }
    ]
  },
  {
    country: "Malasya",
    documents: [
      { type: "ID Card", name: "MYS2001", code: "MY_ID" },
      { type: "Passport", name: "MY_Passport", code: "MY" }
    ]
  },
  {
    country: "Malawi",
    documents: [{ type: "Passport", name: "MW_Passport", code: "MW" }]
  },
  {
    country: "Mali",
    documents: [{ type: "Passport", name: "ML_Passport", code: "ML" }]
  },
  {
    country: "Mauritania",
    documents: [{ type: "Passport", name: "MR_Passport", code: "MR" }]
  },
  {
    country: "Mexico",
    documents: [{ type: "Passport", name: "MX_Passport", code: "MX" }]
  },
  {
    country: "Moldova, Republic of",
    documents: [
      { type: "ID Card", name: "MD_IDCard_2015", code: "MD_ID" },
      { type: "Passport", name: "MD_Passport", code: "MD" }
    ]
  },
  {
    country: "Namibia",
    documents: [{ type: "Passport", name: "NA_Passport", code: "NA" }]
  },
  {
    country: "Netherlands",
    documents: [
      {
        type: "Driving License",
        name: "NL_DrivingLicense_2014",
        code: "NL_DL"
      },
      { type: "ID Card", name: "NL_IDCard_2014", code: "NL_ID" },
      { type: "Passport", name: "NL_Passport", code: "NL" }
    ]
  },
  {
    country: "Norway",
    documents: [
      {
        type: "Driving License",
        name: "NO_DrivingLicense_2013",
        code: "NO_DL"
      },
      { type: "Passport", name: "NO_Passport", code: "NO" }
    ]
  },
  {
    country: "New Zealand",
    documents: [
      {
        type: "Driving License",
        name: "NZ_DrivingLicense_2007",
        code: "NZ_DL"
      },
      { type: "Passport", name: "NZ_Passport", code: "NZ" }
    ]
  },
  {
    country: "Nicaragua",
    documents: [{ type: "Passport", name: "NI_Passport", code: "NI" }]
  },
  {
    country: "Niger",
    documents: [{ type: "Passport", name: "NE_Passport", code: "NE" }]
  },
  {
    country: "Niger",
    documents: [{ type: "Passport", name: "NG_Passport", code: "NG" }]
  },
  {
    country: "Oman *",
    documents: [{ type: "Passport", name: "OM_Passport", code: "OM" }]
  },
  {
    country: "Pakistan",
    documents: [{ type: "Passport", name: "PK_Passport", code: "PK" }]
  },
  {
    country: "Poland",
    documents: [
      {
        type: "Driving License",
        name: "PL_DrivingLicense_2013",
        code: "PL_DL"
      },
      { type: "ID Card", name: "PL_IDCard_2019", code: "PL_ID" },
      { type: "Passport", name: "PL_Passport", code: "PL" }
    ]
  },
  {
    country: "Portugal",
    documents: [
      {
        type: "Driving License",
        name: "PT_DrivingLicense_2013",
        code: "PT_DL"
      },
      { type: "ID Card", name: "PT_IDCard_2015", code: "PT_ID" },
      { type: "Passport", name: "PT_Passport", code: "PT" }
    ]
  },
  {
    country: "Panama",
    documents: [
      { type: "ID Card", name: "PA_IDCard_2010", code: "PA_ID" },
      { type: "Passport", name: "PA_Passport", code: "PA" }
    ]
  },
  {
    country: "Papua New Guinea",
    documents: [{ type: "Passport", name: "PG_Passport", code: "PG" }]
  },
  {
    country: "Paraguay",
    documents: [
      { type: "ID Card", name: "PY_IDCard_2009", code: "PY_ID" },
      { type: "Passport", name: "PY_Passport", code: "PY" }
    ]
  },
  {
    country: "Peru",
    documents: [
      { type: "ID Card", name: "PE_IDCard_2020", code: "PE_ID" },
      { type: "Passport", name: "PE_Passport", code: "PE" }
    ]
  },
  {
    country: "Philippines",
    documents: [
      {
        type: "Driving License",
        name: "PH_DrivingLicense_2017",
        code: "PH_DL"
      },
      { type: "ID Card", name: "PH_IDCard_2016", code: "PH_ID" },
      { type: "Passport", name: "PH_Passport", code: "PH" }
    ]
  },
  {
    country: "Qatar",
    documents: [{ type: "Passport", name: "QA_Passport", code: "QA" }]
  },
  {
    country: "Romania",
    documents: [
      {
        type: "Driving License",
        name: "RO_DrivingLicense_2013",
        code: "RO_DL"
      },
      { type: "ID Card", name: "RO_IDCard_2017", code: "RO_ID" },
      { type: "Passport", name: "RO_Passport", code: "RO" }
    ]
  },
  {
    country: "Russian Federation",
    documents: [
      {
        type: "Driving License",
        name: "RU_DrivingLicense_2011",
        code: "RU_DL"
      },
      { type: "Passport", name: "RU_Passport", code: "RU" }
    ]
  },
  {
    country: "Rwanda",
    documents: [{ type: "Passport", name: "RW_Passport", code: "RW" }]
  },
  {
    country: "Sao Tome and Principe",
    documents: [{ type: "Passport", name: "ST_Passport", code: "ST" }]
  },
  {
    country: "Saudi Arabia *",
    documents: [{ type: "Passport", name: "SA_Passport", code: "SA" }]
  },
  {
    country: "Senegal",
    documents: [{ type: "Passport", name: "SN_Passport", code: "SN" }]
  },
  {
    country: "Serbia",
    documents: [
      { type: "ID Card", name: "RS_IDCard_2008", code: "RS_ID" },
      { type: "Passport", name: "RS_Passport", code: "RS" }
    ]
  },
  {
    country: "Seychelles",
    documents: [{ type: "Passport", name: "SC_Passport", code: "SC" }]
  },
  {
    country: "Singapore",
    documents: [
      { type: "ID Card", name: "SG_IDCard_2011", code: "SG_ID" },
      { type: "Passport", name: "SG_Passport", code: "SG" }
    ]
  },
  {
    country: "Sierra Leone",
    documents: [{ type: "Passport", name: "SL_Passport", code: "SL" }]
  },
  {
    country: "Sweden",
    documents: [
      {
        type: "Driving License",
        name: "SE_DrivingLicense_2013",
        code: "SE_DL"
      },
      { type: "ID Card", name: "SE_IDCard_2012", code: "SE_ID" },
      { type: "Passport", name: "SE_Passport", code: "SE" }
    ]
  },
  {
    country: "Slovenia",
    documents: [
      {
        type: "Driving License",
        name: "SI_DrivingLicense_2013",
        code: "SE_DL"
      },
      { type: "ID Card", name: "SI_IDCard_1998", code: "SI_ID" },
      { type: "Passport", name: "SI_Passport", code: "SI" }
    ]
  },
  {
    country: "Slovak Republic (Slovakia)",
    documents: [
      {
        type: "Driving License",
        name: "SK_DrivingLicense_2013",
        code: "SK_DL"
      },
      { type: "ID Card", name: "SK_IDCard_2015", code: "SK_ID" },
      { type: "Passport", name: "SK_Passport", code: "SK" }
    ]
  },
  {
    country: "Somalia",
    documents: [{ type: "Passport", name: "SO_Passport", code: "SO" }]
  },
  {
    country: "South Africa",
    documents: [{ type: "Passport", name: "ZA_Passport", code: "ZA" }]
  },
  {
    country: "Spain",
    documents: [
      {
        type: "Driving License",
        name: "ES_DrivingLicense_2013",
        code: "ES2_DL"
      },
      { type: "ID Card", name: "ES_IDCard_2015", code: "ES2_ID" },
      {
        type: "Residence Permit",
        name: "ES_ResidencePermit_2020",
        code: "ES2_RP"
      },
      { type: "Passport", name: "ES_Passport", code: "ES" }
    ]
  },
  {
    country: "Sri Lanka",
    documents: [{ type: "Passport", name: "LK_Passport", code: "LK" }]
  },
  {
    country: "Sudan, Republic of",
    documents: [{ type: "Passport", name: "SS_Passport", code: "SS" }]
  },
  {
    country: "Suriname",
    documents: [{ type: "Passport", name: "SR_Passport", code: "SR" }]
  },
  {
    country: "Turkey",
    documents: [
      { type: "ID Card", name: "TR_IDCard_2016", code: "TR_ID" },
      { type: "Passport", name: "TR_Passport", code: "TR" }
    ]
  },
  {
    country: "Ukraine",
    documents: [
      { type: "ID Card", name: "UA_IDCard_2016", code: "UA_ID" },
      { type: "Passport", name: "UA_Passport", code: "UA" }
    ]
  },
  {
    country: "Uruguay",
    documents: [
      { type: "ID Card", name: "UY_IDcard_2015", code: "UY_ID" },
      { type: "Passport", name: "UY_Passport", code: "UY" }
    ]
  },
  {
    country: "Uzbekistan",
    documents: [{ type: "Passport", name: "UZ_Passport", code: "UZ" }]
  },
  {
    country: "United Arab Emirates (DIFC)",
    documents: [{ type: "Passport", name: "AE_Passport", code: "AE" }]
  },
  {
    country: "United States of America",
    state: "Alaska",
    documents: [
      {
        type: "Driving License",
        name: "US-AK_DrivingLicense_2018",
        code: "US-AK_DL"
      },
      { type: "Passport", name: "US-AK_Passport", code: "US-AK" }
    ]
  },
  {
    country: "United States of America",
    state: "Alabama",
    documents: [
      {
        type: "Driving License",
        name: "US-Al_DrivingLicense_2013",
        code: "US-AL_DL"
      },
      { type: "ID Card", name: "US-AL_IDCard_2013", code: "US-AL_ID" },
      { type: "Passport", name: "US-AL_Passport", code: "US-AL" }
    ]
  },
  {
    country: "United States of America",
    state: "Arkansas",
    documents: [
      {
        type: "Driving License",
        name: "US-AR_DrivingLicense_2018",
        code: "US-AR_DL"
      },
      { type: "Passport", name: "US-AR_Passport", code: "US-AR" }
    ]
  },
  {
    country: "United States of America",
    state: "Arizona",
    documents: [
      {
        type: "Driving License",
        name: "US-AZ_DrivingLicense_1996",
        code: "US-AZ_DL"
      },
      { type: "Passport", name: "US-AZ_Passport", code: "US-AZ" }
    ]
  },
  {
    country: "United States of America",
    state: "California",
    documents: [
      {
        type: "Driving License",
        name: "US-CA_DrivingLicense_2018",
        code: "US-CA_DL"
      },
      { type: "Passport", name: "US-CA_Passport", code: "US-CA" }
    ]
  },
  {
    country: "United States of America",
    state: "Colorado",
    documents: [
      {
        type: "Driving License",
        name: "US-CO_DrivingLicense_2016",
        code: "US-CO_DL"
      },
      { type: "Passport", name: "US-CO_Passport", code: "US-CO" }
    ]
  },
  {
    country: "United States of America",
    state: "Connecticut",
    documents: [
      {
        type: "Driving License",
        name: "US-CT_DrivingLicense_2017",
        code: "US-CT_DL"
      },
      { type: "Passport", name: "US-CT_Passport", code: "US-CT" }
    ]
  },
  {
    country: "United States of America",
    state: "District of Columbia ",
    documents: [
      {
        type: "Driving License",
        name: "US-DC_DrivingLicense_2017",
        code: "US-DC_DL"
      },
      { type: "Passport", name: "US-DC_Passport", code: "US-DC" }
    ]
  },
  {
    country: "United States of America",
    state: "Delware",
    documents: [
      {
        type: "Driving License",
        name: "US-DE_DrivingLicense_2010",
        code: "US-DE_DL"
      },
      { type: "Passport", name: "US-DE_Passport", code: "US-DE" }
    ]
  },
  {
    country: "United States of America",
    state: "Florida",
    documents: [
      {
        type: "Driving License",
        name: "US-FL_DrivingLicense_2017",
        code: "US-FL_DL"
      },
      { type: "Passport", name: "US-FL_Passport", code: "US-FL" }
    ]
  },
  {
    country: "United States of America",
    state: "Georgia",
    documents: [
      {
        type: "Driving License",
        name: "US-GA_DrivingLicense_2012",
        code: "US-GA_DL"
      },
      { type: "Passport", name: "US-GA_Passport", code: "US-GA" }
    ]
  },
  {
    country: "United States of America",
    state: "Hawaii",
    documents: [
      {
        type: "Driving License",
        name: "US-HI_DrivingLicense_2018",
        code: "US-HI_DL"
      },
      { type: "Passport", name: "US-HI_Passport", code: "US-HI" }
    ]
  },
  {
    country: "United States of America",
    state: "Iowa",
    documents: [
      {
        type: "Driving License",
        name: "US-IA_DrivingLicense_2018",
        code: "US-IA_DL"
      },
      { type: "Passport", name: "US-IA_Passport", code: "US-IA" }
    ]
  },
  {
    country: "United States of America",
    state: "Idaho",
    documents: [
      {
        type: "Driving License",
        name: "US-ID_DrivingLicense_2017",
        code: "US-ID_DL"
      },
      { type: "Passport", name: "US-ID_Passport", code: "US-ID" }
    ]
  },
  {
    country: "United States of America",
    state: "Illinois",
    documents: [
      {
        type: "Driving License",
        name: "US-IL_DrivingLicense_2016",
        code: "US-IL_DL"
      },
      { type: "Passport", name: "US-IL_Passport", code: "US-IL" }
    ]
  },
  {
    country: "United States of America",
    state: "Indiana",
    documents: [
      {
        type: "Driving License",
        name: "US-IN_DrivingLicense_2017",
        code: "US-IN_DL"
      },
      { type: "Passport", name: "US-IN_Passport", code: "US-IN" }
    ]
  },
  {
    country: "United States of America",
    state: "Kansas",
    documents: [
      {
        type: "Driving License",
        name: "US-KS_DrivingLicense_2017",
        code: "US-KS_DL"
      },
      { type: "Passport", name: "US-KS_Passport", code: "US-KS" }
    ]
  },
  {
    country: "United States of America",
    state: "Kentucky",
    documents: [
      {
        type: "Driving License",
        name: "US-KY_DrivingLicense_2019",
        code: "US-KY_DL"
      },
      { type: "Passport", name: "US-KY_Passport", code: "US-KY" }
    ]
  },
  {
    country: "United States of America",
    state: "Louisiana",
    documents: [
      {
        type: "Driving License",
        name: "US-LA_DrivingLicense_2014",
        code: "US-LA_DL"
      },
      { type: "Passport", name: "US-LA_Passport", code: "US-LA" }
    ]
  },
  {
    country: "United States of America",
    state: "Massachusetts",
    documents: [
      {
        type: "Driving License",
        name: "US-MA_DrivingLicense_2018",
        code: "US-MA_DL"
      },
      { type: "Passport", name: "US-MA_Passport", code: "US-MA" }
    ]
  },
  {
    country: "United States of America",
    state: "Maine",
    documents: [
      {
        type: "Driving License",
        name: "US-ME_DrivingLicense_2011",
        code: "US-ME_DL"
      },
      { type: "Passport", name: "US-ME_Passport", code: "US-ME" }
    ]
  },
  {
    country: "United States of America",
    state: "Michigan",
    documents: [
      {
        type: "Driving License",
        name: "US-MI_DrivingLicense_2017",
        code: "US-MI_DL"
      },
      { type: "Passport", name: "US-MI_Passport", code: "US-MI" }
    ]
  },
  {
    country: "United States of America",
    state: "Minnesota",
    documents: [
      {
        type: "Driving License",
        name: "US-MN_DrivingLicense_2018",
        code: "US-MN_DL"
      },
      { type: "Passport", name: "US-MN_Passport", code: "US-MN" }
    ]
  },
  {
    country: "United States of America",
    state: "Missouri",
    documents: [
      {
        type: "Driving License",
        name: "US-MO_DrivingLicense_2012",
        code: "US-MO_DL"
      },
      { type: "Passport", name: "US-MO_Passport", code: "US-MO" }
    ]
  },
  {
    country: "United States of America",
    state: "Mississippi",
    documents: [
      {
        type: "Driving License",
        name: "US-MS_DrivingLicense_2017",
        code: "US-MS_DL"
      },
      { type: "Passport", name: "US-MS_Passport", code: "US-MS" }
    ]
  },
  {
    country: "United States of America",
    state: "Montana",
    documents: [
      {
        type: "Driving License",
        name: "US-MT_DrivingLicense_2008",
        code: "US-MT_DL"
      },
      { type: "Passport", name: "US-MT_Passport", code: "US-MT" }
    ]
  },
  {
    country: "United States of America",
    state: "North Carolina",
    documents: [
      {
        type: "Driving License",
        name: "US-NC_DrivingLicense_2017",
        code: "US-NC_DL"
      },
      { type: "Passport", name: "US-NC_Passport", code: "US-NC" }
    ]
  },
  {
    country: "United States of America",
    state: "North Dakota",
    documents: [
      {
        type: "Driving License",
        name: "US-ND_DrivingLicense_2018",
        code: "US-ND_DL"
      },
      { type: "Passport", name: "US-ND_Passport", code: "US-ND" }
    ]
  },
  {
    country: "United States of America",
    state: "Nebraska",
    documents: [
      {
        type: "Driving License",
        name: "US-NE_DrivingLicense_2017",
        code: "US-NE_DL"
      },
      { type: "Passport", name: "US-NE_Passport", code: "US-NE" }
    ]
  },
  {
    country: "United States of America",
    state: "New Hampshire",
    documents: [
      {
        type: "Driving License",
        name: "US-NH_DrivingLicense_2017",
        code: "US-NH_DL"
      },
      { type: "Passport", name: "US-NH_Passport", code: "US-NH" }
    ]
  },
  {
    country: "United States of America",
    state: "New Jersey",
    documents: [
      {
        type: "Driving License",
        name: "US-NJ_DrivingLicense_2011",
        code: "US-NJ_DL"
      },
      { type: "Passport", name: "US-NJ_Passport", code: "US-NJ" }
    ]
  },
  {
    country: "United States of America",
    state: "New Mexico",
    documents: [
      {
        type: "Driving License",
        name: "US-NM_DrivingLicense_2016",
        code: "US-NM_DL"
      },
      { type: "Passport", name: "US-NM_Passport", code: "US-NM" }
    ]
  },
  {
    country: "United States of America",
    state: "Nevada",
    documents: [
      {
        type: "Driving License",
        name: "US-NV_DrivingLicense_2014",
        code: "US-NV_DL"
      },
      { type: "Passport", name: "US-NV_Passport", code: "US-NV" }
    ]
  },
  {
    country: "United States of America",
    state: "New York",
    documents: [
      {
        type: "Driving License",
        name: "US-NY_DrivingLicense_2017",
        code: "US-NY_DL"
      },
      { type: "Passport", name: "US-NY_Passport", code: "US-NY" }
    ]
  },
  {
    country: "United States of America",
    state: "Ohio",
    documents: [
      {
        type: "Driving License",
        name: "US-OH_DrivingLicense_2018",
        code: "US-OH_DL"
      },
      { type: "Passport", name: "US-OH_Passport", code: "US-OH" }
    ]
  },
  {
    country: "United States of America",
    state: "Oklahoma",
    documents: [
      {
        type: "Driving License",
        name: "US-OK_DrivingLicense_2018",
        code: "US-OK_DL"
      },
      { type: "Passport", name: "US-OK_Passport", code: "US-OK" }
    ]
  },
  {
    country: "United States of America",
    state: "Oregon",
    documents: [
      {
        type: "Driving License",
        name: "US-OR_DrivingLicense_2018",
        code: "US-OR_DL"
      },
      { type: "Passport", name: "US-OR_Passport", code: "US-OR" }
    ]
  },
  {
    country: "United States of America",
    state: "Pennsylvania",
    documents: [
      {
        type: "Driving License",
        name: "US-PA_DrivingLicense_2017",
        code: "US-PA_DL"
      },
      { type: "Passport", name: "US-PA_Passport", code: "US-PA" }
    ]
  },
  {
    country: "United States of America",
    state: "Rhode Island",
    documents: [
      {
        type: "Driving License",
        name: "US-RI_DrivingLicense_2018",
        code: "US-RI_DL"
      },
      { type: "Passport", name: "US-RI_Passport", code: "US-RI" }
    ]
  },
  {
    country: "United States of America",
    state: "South Carolina",
    documents: [
      {
        type: "Driving License",
        name: "US-SC_DrivingLicense_2018",
        code: "US-SC_DL"
      },
      { type: "Passport", name: "US-SC_Passport", code: "US-SC" }
    ]
  },
  {
    country: "United States of America",
    state: "South Dakota",
    documents: [
      {
        type: "Driving License",
        name: "US-SD_DrivingLicense_2010",
        code: "US-SD_DL"
      },
      { type: "Passport", name: "US-SD_Passport", code: "US-SD" }
    ]
  },
  {
    country: "United States of America",
    state: "Tennessee",
    documents: [
      {
        type: "Driving License",
        name: "US-TN_DrivingLicense_2012",
        code: "US-TN_DL"
      },
      { type: "Passport", name: "US-TN_Passport", code: "US-TN" }
    ]
  },
  {
    country: "United States of America",
    state: "Texas",
    documents: [
      {
        type: "Driving License",
        name: "US-TX_DrivingLicense_2016",
        code: "US-TX_DL"
      },
      { type: "ID Card", name: "US-TX_IDCard_2016", code: "US-TX_ID" },
      { type: "Passport", name: "US-TX_Passport", code: "US-TX" }
    ]
  },
  {
    country: "United States of America",
    state: "Utah",
    documents: [
      {
        type: "Driving License",
        name: "US-UT_DrivingLicense_2016",
        code: "US-UT_DL"
      },
      { type: "Passport", name: "US-UT_Passport", code: "US-UT" }
    ]
  },
  {
    country: "United States of America",
    state: "Virginia",
    documents: [
      {
        type: "Driving License",
        name: "US-VA_DrivingLicense_2018",
        code: "US-VA_DL"
      },
      { type: "ID Card", name: "US-VA_IDCard_2018", code: "US-VA_ID" },
      { type: "Passport", name: "US-VA_Passport", code: "US-VA" }
    ]
  },
  {
    country: "United States of America",
    state: "Vermont",
    documents: [
      {
        type: "Driving License",
        name: "US-VT_DrivingLicense_2018",
        code: "US-VT_DL"
      },
      { type: "Passport", name: "US-VT_Passport", code: "US-VT" }
    ]
  },
  {
    country: "United States of America",
    state: "Wisconsin",
    documents: [
      {
        type: "Driving License",
        name: "US-WI_DrivingLicense_2015",
        code: "US-WI_DL"
      },
      { type: "Passport", name: "US-WI_Passport", code: "US-WI" }
    ]
  },
  {
    country: "United States of America",
    state: "West Virginia",
    documents: [
      {
        type: "Driving License",
        name: "US-WV_DrivingLicense_2013",
        code: "US-WV_DL"
      },
      { type: "Passport", name: "US-WV_Passport", code: "US-WV" }
    ]
  },
  {
    country: "United States of America",
    state: "Wyoming",
    documents: [
      {
        type: "Driving License",
        name: "US-WY_DrivingLicense_2014",
        code: "US-WY_DL"
      },
      { type: "Passport", name: "US-WY_Passport", code: "US-WY" }
    ]
  },
  {
    country: "Canada",
    state: "Alberta",
    documents: [
      {
        type: "Driving License",
        name: "CA-AB_DrivingLicense_2009",
        code: "CA-AB_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "British Columbia",
    documents: [
      {
        type: "Driving License",
        name: "CA-BC_DrivingLicense_2013",
        code: "CA-BC_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Manitoba",
    documents: [
      {
        type: "Driving License",
        name: "CA-MB_DrivingLicense_2014",
        code: "CA-MB_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Newfoundland and Labrador",
    documents: [
      {
        type: "Driving License",
        name: "CA-NL_DrivingLicense_2017",
        code: "CA-NL_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Northwest Territories",
    documents: [
      {
        type: "Driving License",
        name: "CA-NT_DrivingLicense_2005",
        code: "CA-NT_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Nova Scotia",
    documents: [
      {
        type: "Driving License",
        name: "CA-NS_DrivingLicense_2017",
        code: "CA-NS_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Nunavut",
    documents: [
      {
        type: "Driving License",
        name: "CA-NU_DrivingLicense_2009",
        code: "CA-NU_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Ontario",
    documents: [
      {
        type: "Driving License",
        name: "CA-ON_DrivingLicense_2007",
        code: "CA-ON_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Prince Edward Island",
    documents: [
      {
        type: "Driving License",
        name: "CA-PE_DrivingLicense_2017",
        code: "CA-PE_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Quebec State",
    documents: [
      {
        type: "Driving License",
        name: "CA-QC_DrivingLicense_2015",
        code: "CA-QC_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Saskatchewan State",
    documents: [
      {
        type: "Driving License",
        name: "CA-SK_DrivingLicense_2016",
        code: "CA-SK_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "Yukon",
    documents: [
      {
        type: "Driving License",
        name: "CA-YT_DrivingLicense_2010",
        code: "CA-YT_DL"
      }
    ]
  },
  {
    country: "Canada",
    state: "New Brunswick",
    documents: [
      {
        type: "Driving License",
        name: "CA-NB_DrivingLicense_2017",
        code: "CA-NB_DL"
      },
      { type: "ID Card", name: "CA-NB_IDCard_2020", code: "CA-NB_DL" }
    ]
  },
  {
    country: "Dominica",
    documents: [{ type: "Passport", name: "DM_Passport", code: "DM" }]
  },
  {
    country: "Dominican Republic",
    documents: [
      { type: "ID Card", name: "DO_IDCard_2014", code: "DO_ID" },
      { type: "Passport", name: "DO_Passport", code: "DO" }
    ]
  },
  {
    country: "Malaysia",
    documents: [
      { type: "ID Card", name: "MY_IDCard_2012", code: "MY_ID" },
      { type: "Passport", name: "MY_Passport", code: "MY" }
    ]
  },
  {
    country: "Venezuela",
    documents: [
      { type: "ID Card", name: "VE_IDCard_2011", code: "VE_ID" },
      { type: "Passport", name: "VE_Passport", code: "VE" }
    ]
  },
  {
    country: "Yemen",
    documents: [{ type: "Passport", name: "YE_Passport", code: "YE" }]
  },
  {
    country: "Zambia",
    documents: [{ type: "Passport", name: "ZM_Passport", code: "ZM" }]
  },
  {
    country: "Nigeria",
    documents: [{ type: "Passport", name: "NG_Passport", code: "NG" }]
  },
  {
    country: "Gabon",
    documents: [{ type: "Passport", name: "NG_Passport", code: "NG" }]
  },
  {
    country: "Guyana",
    documents: [{ type: "Passport", name: "NG_Passport", code: "NG" }]
  },
  {
    country: "Zimbabwe",
    documents: [{ type: "Passport", name: "ZW_Passport", code: "ZW" }]
  }
];

export const defaultCountryDocs = [
  ["drivingLicense", "Driving License"],
  ["idCard", "ID Card"],
  ["passport", "Passport"]
];
