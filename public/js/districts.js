////// Define metadata
var allData = [];
var dedupeData = [];
var meta = {}

////// Define starting parameters
// Note that this will need to become more flexible when things beside CCD become available.
meta.filterList = {};
meta.filterList.short = {
	state_location: [],
	school_type: [],
	school_level: [],
	leaid: [],
	ncessch: [],
	charter: []
};
meta.filterList.short.year = [2014];
meta.filterList.long = {
	state_location: [],
	school_type: [],
	school_level: [],
	leaid: [],
	ncessch: [],
	charter: []
};

// this is the place where states that have already been loaded are remembered.
meta.filterList.loadedStates = {}

meta.universe = "ccd";
meta.primaryVar = "ncessch";
meta.files = [];
meta.generatedURLS = {
	"wide":[],
	"long":[]
};
meta.selectedattributes = [];
meta.metaListOriginal = [];
meta.attributeMetadata = [];
// meta.year = [2014];