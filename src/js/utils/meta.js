/* requires:
states.js
*/

meta.rootURL = "https://educationdata.urban.org";
meta.api = "/api/v1/api-db-values/";

meta.ccd = {}

// the ccd shortfields is the ccd fields that we are getting from the API in order to do initial filtering and data retrieval
meta.ccd.shortFields = [
	"city_location",
	"school_type",
	"school_level",
	// "lowest_grade_offered",
	// "highest_grade_offered",
	"charter",
	"school_name",
	"ncessch",
	"leaid",
	"lea_name",
	"state_location",
	"fips"
	// "latitude",
	// "longitude"
];
meta.ccd.allVars = ["year","ncessch","school_id","school_name","leaid","lea_name","state_leaid","seasch","street_mailing","city_mailing","state_mailing","zip_mailing","street_location","city_location","state_location","zip_location","phone","fips","latitude","longitude","csa","cbsa","urban_centric_locale","county_code","school_level","school_type","school_status","lowest_grade_offered","highest_grade_offered","bureau_indian_education","title_i_status","title_i_eligible","title_i_schoolwide","charter","magnet","shared_time","virtual","teachers_fte","free_lunch","reduced_price_lunch","free_or_reduced_price_lunch"];

// The presets are 
meta.ccd.presets = {}
meta.ccd.presets.school_level = [
	{
		"id": 1,
		"value": "Elementary"
	},
	{
		"id": 2,
		"value": "Middle"
	},
	{
		"id": 3,
		"value": "High"
	},
	{
		"id": 4,
		"value": "Other"
	}
]

meta.ccd.presets.school_type = [
	{
		"id": 1,
		"value":"Regular school"
	},
	{
		"id": 2,
		"value":"Special education school"
	},
	{
		"id": 3,
		"value":"Vocational school"
	},
	{
		"id": 4,
		"value":"Other/alternative school"
	},
	{
		"id": 5,
		"value":"Reportable program"
	}
]
meta.ccd.presets.charter = [
	{
		"id": 0,
		"value":"No"
	},
	{
		"id": 1,
		"value":"Yes"
	}
]
meta.ccd.presets.state_location = justStates
meta.ccd.presets.leaid = [];
meta.ccd.presets.ncessch = [];
meta.ccd.geofilters = [
	{
		"proper_name":"lea_name",
		"data_name":"leaid",
		"rank":1
	},
	{
		"proper_name": "school_name",
		"data_name":"ncessch",
		"rank":0
	}
];
// in the future also these? "school_name","lea_name","state_location","city_location"

// all endpoints for SCHOOLS
// meta.ccd.endpoints = [46,53,37,69,24,41,42,34,25,73]; // THIS NEEDS TO BE UPDATED, to DEDUPE for all ccd/crdc schools stuff!!!
meta.ccd.endpoints = [
	{
		endpoint_id: 24,
		is_long: false,
		name: "ccd directory"	
	},
	{
		endpoint_id: 28,
		is_long: true,
		name: "ccd enrollment"	
	}
];

meta.ccd_lea = {};
meta.ccd_lea.shortFields = [];
meta.ccd_lea.allVars = ["year","leaid","lea_name","fips","state_leaid","street_mailing","city_mailing","state_mailing","zip_mailing","zip4_mailing","street_location","city_location","state_location","zip_location","zip4_location","phone","latitude","longitude","urban_centric_locale","cbsa","cbsa_type","csa","cmsa","necta","county_code","county_name","congress_district_id","bureau_indian_education","supervisory_union_number","agency_type","boundary_change_indicator","agency_charter_indicator","lowest_grade_offered","highest_grade_offered","number_of_schools","enrollment","spec_ed_students","english_language_learners","migrant_students"];
meta.ccd_lea.endpoints = [29,54,56,30];

meta.ipeds = {};
meta.ipeds.shortFields = [];
meta.ipeds.allVars = ["unitid","offering_highest_level","region","inst_control","institution_level","sector","fips","hbcu","primarily_postsecondary","hospital","medical_degree","tribal_college","urban_centric_locale","offering_highest_degree","currently_active_ipeds","title_iv_indicator","offering_undergrad","offering_grad","newid","year_deleted","degree_granting","open_public","postsec_public_active","postsec_public_active_title_iv","inst_system_flag","reporting_method","inst_category","land_grant","inst_size","cbsa","cbsa_type","csa","necta","comparison_group","county_fips","congress_district_id","cc_basic_2010","cc_instruc_undergrad_2010","cc_instruc_grad_2010","cc_undergrad_2010","cc_enroll_2010","cc_size_setting_2010","cc_basic_2000","comparison_group_custom","cc_basic_2015","cc_instruc_undergrad_2015","cc_instruc_grad_2015","cc_undergrad_2015","cc_enroll_2015","cc_size_setting_2015","inst_status","hbcu"];
