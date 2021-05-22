"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var phoenix_chart_type_1 = require("../enums/phoenix-chart-type");
var africa_json_1 = __importDefault(require("../maps/africa.json"));
var asia_json_1 = __importDefault(require("../maps/asia.json"));
var australia_json_1 = __importDefault(require("../maps/australia.json"));
var austria_json_1 = __importDefault(require("../maps/austria.json"));
var brazil_json_1 = __importDefault(require("../maps/brazil.json"));
var canada_json_1 = __importDefault(require("../maps/canada.json"));
var chile_json_1 = __importDefault(require("../maps/chile.json"));
var china_json_1 = __importDefault(require("../maps/china.json"));
var europe_json_1 = __importDefault(require("../maps/europe.json"));
var france_json_1 = __importDefault(require("../maps/france.json"));
var france_dept_json_1 = __importDefault(require("../maps/france_dept.json"));
var germany_json_1 = __importDefault(require("../maps/germany.json"));
var ghana_json_1 = __importDefault(require("../maps/ghana.json"));
var india_json_1 = __importDefault(require("../maps/india.json"));
var indonesia_json_1 = __importDefault(require("../maps/indonesia.json"));
var italy_json_1 = __importDefault(require("../maps/italy.json"));
var japan_json_1 = __importDefault(require("../maps/japan.json"));
var malaysia_json_1 = __importDefault(require("../maps/malaysia.json"));
var mexico_json_1 = __importDefault(require("../maps/mexico.json"));
var middle_east_json_1 = __importDefault(require("../maps/middle_east.json"));
var new_zealand_json_1 = __importDefault(require("../maps/new_zealand.json"));
var nigeria_json_1 = __importDefault(require("../maps/nigeria.json"));
var north_america_json_1 = __importDefault(require("../maps/north_america.json"));
var panama_json_1 = __importDefault(require("../maps/panama.json"));
var peru_json_1 = __importDefault(require("../maps/peru.json"));
var philippines_json_1 = __importDefault(require("../maps/philippines.json"));
var portugal_json_1 = __importDefault(require("../maps/portugal.json"));
var south_america_json_1 = __importDefault(require("../maps/south_america.json"));
var south_korea_json_1 = __importDefault(require("../maps/south_korea.json"));
var spain_json_1 = __importDefault(require("../maps/spain.json"));
var switzerland_json_1 = __importDefault(require("../maps/switzerland.json"));
var uae_json_1 = __importDefault(require("../maps/uae.json"));
var united_kingdom_json_1 = __importDefault(require("../maps/united_kingdom.json"));
var us_json_1 = __importDefault(require("../maps/us.json"));
var world_json_1 = __importDefault(require("../maps/world.json"));
function _getMapDefinition(type) {
    switch (type) {
        case phoenix_chart_type_1.CHART_TYPE.MAP_UNITED_STATES:
            return us_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_WORLD:
        case phoenix_chart_type_1.CHART_TYPE.MAP_LATLONG:
            return world_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_CANADA:
            return canada_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_AUSTRALIA:
            return australia_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_JAPAN:
            return japan_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_AFRICA:
            return africa_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_ASIA:
            return asia_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_AUSTRIA:
            return austria_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_BRAZIL:
            return brazil_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_CHILE:
            return chile_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_CHINA:
            return china_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_EUROPE:
            return europe_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_FRANCE:
            return france_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_FRANCE_DEPARTMENTS:
            return france_dept_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_GERMANY:
            return germany_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_GHANA:
            return ghana_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_INDIA:
            return india_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_INDONESIA:
            return indonesia_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_ITALY:
            return italy_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_MALAYSIA:
            return malaysia_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_MEXICO:
            return mexico_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_MIDDLE_EAST:
            return middle_east_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_NEW_ZEALAND:
            return new_zealand_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_NIGERIA:
            return nigeria_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_NORTH_AMERICA:
            return north_america_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_PANAMA:
            return panama_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_PERU:
            return peru_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_PHILIPPINES:
            return philippines_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_PORTUGAL:
            return portugal_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_SOUTH_AMERICA:
            return south_america_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_SOUTH_KOREA:
            return south_korea_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_SPAIN:
            return spain_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_SWITZERLAND:
            return switzerland_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_UAE:
            return uae_json_1.default;
        case phoenix_chart_type_1.CHART_TYPE.MAP_UNITED_KINGDOM:
            return united_kingdom_json_1.default;
        default:
            throw new Error('[@domoinc/domo-phoenix] Sorry, this map or chart is not supported at this time.');
    }
}
exports._getMapDefinition = _getMapDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWRlZmluaXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NoYXJ0L21hcC1kZWZpbml0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtFQUF5RDtBQUN6RCxvRUFBNkM7QUFDN0MsZ0VBQXlDO0FBQ3pDLDBFQUFtRDtBQUNuRCxzRUFBK0M7QUFDL0Msb0VBQTZDO0FBQzdDLG9FQUE2QztBQUM3QyxrRUFBMkM7QUFDM0Msa0VBQTJDO0FBQzNDLG9FQUE2QztBQUM3QyxvRUFBNkM7QUFDN0MsOEVBQXVEO0FBQ3ZELHNFQUErQztBQUMvQyxrRUFBMkM7QUFDM0Msa0VBQTJDO0FBQzNDLDBFQUFtRDtBQUNuRCxrRUFBMkM7QUFDM0Msa0VBQTJDO0FBQzNDLHdFQUFpRDtBQUNqRCxvRUFBNkM7QUFDN0MsOEVBQXVEO0FBQ3ZELDhFQUF1RDtBQUN2RCxzRUFBK0M7QUFDL0Msa0ZBQTJEO0FBQzNELG9FQUE2QztBQUM3QyxnRUFBeUM7QUFDekMsOEVBQXVEO0FBQ3ZELHdFQUFpRDtBQUNqRCxrRkFBMkQ7QUFDM0QsOEVBQXVEO0FBQ3ZELGtFQUEyQztBQUMzQyw4RUFBdUQ7QUFDdkQsOERBQXVDO0FBQ3ZDLG9GQUE2RDtBQUM3RCw0REFBcUM7QUFDckMsa0VBQTJDO0FBRTNDLFNBQWdCLGlCQUFpQixDQUFDLElBQVk7SUFDNUMsUUFBUSxJQUFJLEVBQUU7UUFDWixLQUFLLCtCQUFVLENBQUMsaUJBQWlCO1lBQy9CLE9BQU8saUJBQU0sQ0FBQztRQUNoQixLQUFLLCtCQUFVLENBQUMsU0FBUyxDQUFDO1FBQzFCLEtBQUssK0JBQVUsQ0FBQyxXQUFXO1lBQ3pCLE9BQU8sb0JBQVMsQ0FBQztRQUNuQixLQUFLLCtCQUFVLENBQUMsVUFBVTtZQUN4QixPQUFPLHFCQUFVLENBQUM7UUFDcEIsS0FBSywrQkFBVSxDQUFDLGFBQWE7WUFDM0IsT0FBTyx3QkFBYSxDQUFDO1FBQ3ZCLEtBQUssK0JBQVUs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