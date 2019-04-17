/* requires:
libs.js
*/


var justStates = [
  {
    "fips": 1,
    "data": "AL",
    "value": "Alabama",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 2,
    "data": "AK",
    "value": "Alaska",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 4,
    "data": "AZ",
    "value": "Arizona",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 5,
    "data": "AR",
    "value": "Arkansas",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 6,
    "data": "CA",
    "value": "California",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 8,
    "data": "CO",
    "value": "Colorado",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 9,
    "data": "CT",
    "value": "Connecticut",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 10,
    "data": "DE",
    "value": "Delaware",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 11,
    "data": "DC",
    "value": "District of Columbia",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 12,
    "data": "FL",
    "value": "Florida",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 13,
    "data": "GA",
    "value": "Georgia",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 15,
    "data": "HI",
    "value": "Hawaii",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 16,
    "data": "ID",
    "value": "Idaho",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 17,
    "data": "IL",
    "value": "Illinois",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 18,
    "data": "IN",
    "value": "Indiana",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 19,
    "data": "IA",
    "value": "Iowa",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 20,
    "data": "KS",
    "value": "Kansas",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 21,
    "data": "KY",
    "value": "Kentucky",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 22,
    "data": "LA",
    "value": "Louisiana",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 23,
    "data": "ME",
    "value": "Maine",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 24,
    "data": "MD",
    "value": "Maryland",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 25,
    "data": "MA",
    "value": "Massachusetts",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 26,
    "data": "MI",
    "value": "Michigan",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 27,
    "data": "MN",
    "value": "Minnesota",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 28,
    "data": "MS",
    "value": "Mississippi",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 29,
    "data": "MO",
    "value": "Missouri",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 30,
    "data": "MT",
    "value": "Montana",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 31,
    "data": "NE",
    "value": "Nebraska",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 32,
    "data": "NV",
    "value": "Nevada",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 33,
    "data": "NH",
    "value": "New Hampshire",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 34,
    "data": "NJ",
    "value": "New Jersey",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 35,
    "data": "NM",
    "value": "New Mexico",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 36,
    "data": "NY",
    "value": "New York",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 37,
    "data": "NC",
    "value": "North Carolina",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 38,
    "data": "ND",
    "value": "North Dakota",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 39,
    "data": "OH",
    "value": "Ohio",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 40,
    "data": "OK",
    "value": "Oklahoma",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 41,
    "data": "OR",
    "value": "Oregon",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 42,
    "data": "PA",
    "value": "Pennsylvania",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 44,
    "data": "RI",
    "value": "Rhode Island",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 45,
    "data": "SC",
    "value": "South Carolina",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 46,
    "data": "SD",
    "value": "South Dakota",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 47,
    "data": "TN",
    "value": "Tennessee",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 48,
    "data": "TX",
    "value": "Texas",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 49,
    "data": "UT",
    "value": "Utah",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 50,
    "data": "VT",
    "value": "Vermont",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 51,
    "data": "VA",
    "value": "Virginia",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 53,
    "data": "WA",
    "value": "Washington",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 54,
    "data": "WV",
    "value": "West Virginia",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 55,
    "data": "WI",
    "value": "Wisconsin",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 56,
    "data": "WY",
    "value": "Wyoming",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 60,
    "data": "AS",
    "value": "America Samoa",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 64,
    "data": "FM",
    "value": "Federated States of Micronesia",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 66,
    "data": "GU",
    "value": "Guam",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 68,
    "data": "MH",
    "value": "Marshall Islands",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 69,
    "data": "MP",
    "value": "Northern Mariana Islands",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 70,
    "data": "PW",
    "value": "Palau",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 72,
    "data": "PR",
    "value": "Puerto Rico",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 74,
    "data": "UM",
    "value": "U.S. Minor Outlying Islands",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 78,
    "data": "VI",
    "value": "Virgin Islands of the United States",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 59,
    "data": "X1",
    "value": "Extra 1",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  },
  {
    "fips": 63,
    "data": "X2",
    "value": "Extra 2",
    "primaryKey":"stateName",
    "searchKey":"state_location"
  }
]