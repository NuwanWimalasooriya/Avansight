"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var phoenix_data_type_1 = require("../enums/phoenix-data-type");
var phoenix_chart_config_1 = require("../interfaces/phoenix-chart-config");
var Phoenix = __importStar(require("../lib/phoenix"));
var map_utils_1 = require("./map-utils");
var DEFAULT_OPTIONS = {
    height: 400,
    width: 500,
    animate: true,
    colors: null,
    componentColors: {},
    backgroundColor: null,
    textColor: null,
    transparentBackground: false
};
var Chart = /** @class */ (function () {
    function Chart(type, data, options) {
        this._type = type;
        this._data = this.transformData(data.columns, data.rows);
        this._options = __assign({}, DEFAULT_OPTIONS, options);
        this._instance = this._createInstance();
        this._instance.setTransparentBackground(this._options.transparentBackground);
        this.setUsePhoenixHover(true);
        this.canvas = this._instance.getCanvas();
    }
    /**
     * Render the Phoenix chart on the canvas element
     */
    Chart.prototype.render = function () {
        this._instance.draw(null, !this._options.animate, false);
    };
    /**
     * Resize the Phoenix chart
     */
    Chart.prototype.resize = function (width, height) {
        this._instance.resize(width, height);
    };
    /**
     * Update the Phoenix chart with new data
     */
    Chart.prototype.update = function (data, options) {
        if (options && options.colors) {
            // Changing color palette, update options
            this._options.colors = options.colors;
        }
        if (options && options.properties) {
            // Changing chart properties, update options
            this._options.properties = options.properties;
        }
        this._data = this.transformData(data.columns, data.rows);
        var configString = this._createConfigString(this._type, this._data, this._options);
        this._packet = configString;
        this._instance.updateChartJson(configString, !this._options.animate);
    };
    /**
     * Update the Phoenix chart with a new set of chart property overrides
     */
    Chart.prototype.setChartProperties = function (properties) {
        this._options.properties = properties;
        this.update(this._data);
    };
    /**
     * Reset the chart color palette to the Domo default palette, redraws the chart
     */
    Chart.prototype.resetColorPalette = function () {
        this._options.colors = null;
        this.update(this._data);
    };
    /**
     * Get the chart packet for debugging
     */
    Chart.prototype.getPacket = function () {
        return this._packet;
    };
    /**
     * Is chart picker available for the current chart and data
     */
    Chart.prototype.isChartPickerAvailable = function () {
        return this._instance.isChartPickerAvailable();
    };
    /**
     * Is the chart picker panel open
     */
    Chart.prototype.isChartPickerOpen = function () {
        return this._instance.isChartPickerOpen();
    };
    /**
     * Show the chart picker panel
     */
    Chart.prototype.showChartPicker = function () {
        this._instance.showChartPicker();
    };
    /**
     * Hide the chart picker panel
     */
    Chart.prototype.hideChartPicker = function () {
        this._instance.hideChartPicker();
    };
    /**
     * Attach a handler to various Phoenix event types
     */
    Chart.prototype.addEventListener = function (type, handler) {
        this._instance.addEventListener(type, handler);
        if (type === 'hover') {
            this.setUsePhoenixHover(false);
        }
    };
    /**
     * Have Phoenix render hover tooltips
     */
    Chart.prototype.setUsePhoenixHover = function (flag) {
        this._instance.setUsePhoenixHover(flag);
    };
    /**
     *
     */
    Chart.prototype.highlight = function (filters) {
        if (filters && filters.length) {
            var needsRedraw = this._instance.highlight(JSON.stringify(filters));
            if (needsRedraw) {
                this._instance.draw();
            }
        }
    };
    Chart.prototype.transformData = function (columns, rows) {
        // Modify grained column objects
        var CalendarJoinColumns = {
            year: 'Year',
            quarter: 'CalendarQuarter',
            month: 'CalendarMonth',
            week: 'CalendarWeek',
            day: 'Date'
        };
        columns.forEach(function (c) {
            if (c.dateGrain != null) {
                c.type = c.dateGrain === 'day' ? phoenix_data_type_1.DATA_TYPE.DATE : phoenix_data_type_1.DATA_TYPE.STRING;
                c.grainColumnName = CalendarJoinColumns[c.dateGrain];
            }
        });
        if (rows &&
            rows[0] &&
            rows[0] instanceof Object &&
            !Array.isArray(rows[0])) {
            // Use "columns" array to convert "rows" to a 2D array
            var make2Dimensional = function (r) {
                var row = [];
                columns &&
                    columns.forEach(function (c) { return row.push(r[c.grainColumnName || c.name]); });
                return row;
            };
            return {
                columns: columns,
                rows: rows.map(make2Dimensional)
            };
        }
        return { columns: columns, rows: rows };
    };
    Chart.prototype._createInstance = function () {
        var configString = this._createConfigString(this._type, this._data, this._options);
        var chart = Phoenix.createPhoenixWithChartState(configString, '{}', this._options.width, this._options.height, true, 0);
        this._packet = configString;
        return chart;
    };
    Chart.prototype._createConfigString = function (type, data, options) {
        var chartConfig = this._toPhoenixConfig(type, data, options);
        var configString = JSON.stringify(chartConfig);
        return configString;
    };
    Chart.prototype._getMapDefinition = function (type) {
        console.error("Could not get definition for \"" + type + "\", this version of domoPhoenix does not include maps.");
        return null;
    };
    Chart.prototype._toPhoenixConfig = function (type, data, options) {
        var _this = this;
        var config = {
            datasources: {
                default: {
                    type: 'ordered-column-list',
                    data: {
                        datasource: 'default',
                        metadata: data.columns.map(function (col) { return ({ type: col.type }); }),
                        mappings: data.columns.map(function (col) { return col.mapping; }),
                        columns: data.columns.map(function (col) { return col.name; }),
                        formats: data.columns.map(function (col) { return _this._getFormat(col.format); }),
                        rows: data.rows,
                        numRows: data.rows.length,
                        numColumns: data.columns.length
                    }
                }
            },
            components: {
                graph: !map_utils_1._isMap(type)
                    ? {
                        type: 'graph',
                        badgetype: type,
                        datasource: 'default',
                        columnFormats: {},
                        overrides: options.properties || {}
                    }
                    : null,
                map: map_utils_1._isMap(type)
                    ? {
                        type: 'map',
                        badgetype: type,
                        mapdef: 'map',
                        datasource: 'default',
                        columnFormats: {},
                        overrides: options.properties || {}
                    }
                    : null
            },
            maps: map_utils_1._isMap(type) && this._getMapDefinition(type),
            conditionalFormats: options.conditionalFormats,
            locale: 'en-US',
            version: '6'
        };
        if (map_utils_1._isMap(type)) {
            // Make sure there is nothing graphs related when it's not a graph
            delete config.components.graph;
        }
        else {
            // Make sure there is nothing maps related when it's not a map
            delete config.maps;
            delete config.components.map;
        }
        if (options.backgroundColor) {
            config.backgroundColor = options.backgroundColor;
        }
        if (options.textColor) {
            config.textColor = options.textColor;
        }
        if (options.colors) {
            config.palette = this._createPalette(options.colors, options.componentColors);
        }
        return config;
    };
    Chart.prototype._getFormat = function (format) {
        if (format != null && format.trim().length > 0) {
            var colFmt = {
                type: 'default',
                format: '#',
                currency: '$',
                commas: false,
                precision: 0,
                percentMultiplied: true,
                percent: false
            };
            format = format.trim();
            if (format.indexOf('%') != -1) {
                colFmt.type = 'percent';
                colFmt.percent = true;
                format = format.trim().substr(0, format.length - 1);
            }
            else {
                var firstChar = format.charAt(0);
                if (firstChar == '$' ||
                    firstChar == '¥' ||
                    firstChar == '€' ||
                    firstChar == '£') {
                    colFmt.type = 'currency';
                    colFmt.currency = firstChar;
                }
            }
            if (format.indexOf(',') != -1) {
                colFmt.commas = true;
                colFmt.format = '###,###';
            }
            var decPos = format.indexOf('.');
            if (decPos != -1) {
                format = format.substr(decPos + 1);
                colFmt.precision = format.trim().length;
                colFmt.format += '.' + format;
            }
            return colFmt;
        }
        return null;
    };
    Chart.prototype._createPalette = function (colors, colorMap) {
        var _a;
        var getColor = function (color) { return color.charAt(0) === '#' ? color.substring(1) : color; };
        var colorRanges = [
            {
                name: 'CustomPalette',
                values: colors.map(function (color) { return getColor(color); }).slice()
            }
        ];
        var colorRules = [
            {
                min: 1,
                max: colors.length,
                values: colors.map(function (_color, index) { return [0, index]; }).slice()
            }
        ];
        var gradients = [
            {
                colCount: colors.length,
                values: colors.map(function (_color, index) { return [0, index]; }).slice()
            }
        ];
        var nameColorMap = (_a = {},
            _a[phoenix_chart_config_1.ComponentColorName.BoxPlotFill] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.BoxPlotStroke] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.CandlestickDnRed] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.CandlestickUpGreen] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.CatScatterFill] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.CatScatterStroke] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.CompGaugeArrowGreen] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.CompGaugeArrowRed] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.CompGaugeDkGreen] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.CompGaugeDkRed] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.CompGaugeLtGreen] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.CompGaugeLtRed] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.FaceGaugeGray] = [0, 3],
            _a[phoenix_chart_config_1.ComponentColorName.FaceGaugeGreen] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.FaceGaugeRed] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.FaceGaugeYellow] = [0, 2],
            _a[phoenix_chart_config_1.ComponentColorName.FilledGaugeGreen] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.FilledGaugeRed] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.ProgressBar] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.WaterfallBlue] = [0, 2],
            _a[phoenix_chart_config_1.ComponentColorName.WaterfallGreen] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.WaterfallRed] = [0, 1],
            _a[phoenix_chart_config_1.ComponentColorName.WordCloudFirstOrange] = [0, 0],
            _a[phoenix_chart_config_1.ComponentColorName.WordCloudSecBlue] = [0, 1],
            _a);
        if (colorMap) {
            var mapRange_1 = { name: 'ColorMapRange', values: [] };
            var mapIndex_1 = colorRanges.push(mapRange_1) - 1;
            Object.keys(colorMap).forEach(function (key) {
                var colorIndex = mapRange_1.values.push(getColor(colorMap[key])) - 1;
                nameColorMap[key] = [mapIndex_1, colorIndex];
            });
        }
        var palette = {
            colorRanges: colorRanges,
            colorRules: colorRules,
            gradients: gradients,
            nameColorMap: nameColorMap,
        };
        return palette;
    };
    return Chart;
}());
exports.Chart = Chart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2hhcnQvY2hhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxnRUFBdUQ7QUFDdkQsMkVBUTRDO0FBRzVDLHNEQUEwQztBQUMxQyx5Q0FBcUM7QUFFckMsSUFBTSxlQUFlLEdBQXdCO0lBQzNDLE1BQU0sRUFBRSxHQUFHO0lBQ1gsS0FBSyxFQUFFLEdBQUc7SUFDVixPQUFPLEVBQUUsSUFBSTtJQUNiLE1BQU0sRUFBRSxJQUFJO0lBQ1osZUFBZSxFQUFFLEVBQUU7SUFDbkIsZUFBZSxFQUFFLElBQUk7SUFDckIsU0FBUyxFQUFFLElBQUk7SUFDZixxQkFBcUIsRUFBRSxLQUFLO0NBQzdCLENBQUM7QUFFRjtJQVFFLGVBQ0UsSUFBZ0IsRUFDaEIsSUFBc0IsRUFDdEIsT0FBNkI7UUFFN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxRQUFRLGdCQUFRLGVBQWUsRUFBSyxPQUFPLENBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUNwQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxzQkFBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJ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