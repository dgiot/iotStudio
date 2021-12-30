"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxControlRenderer = exports.LocationControl = exports.CityPicker = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var theme_1 = require("../../theme");
var components_1 = require("../../components");
var helper_1 = require("../../utils/helper");
var Options_1 = require("./Options");
var locale_1 = require("../../locale");
var CityPicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CityPicker, _super);
    function CityPicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            code: 0,
            province: '',
            provinceCode: 0,
            city: '',
            cityCode: 0,
            district: '',
            districtCode: 0,
            street: ''
        };
        return _this;
    }
    CityPicker.prototype.componentDidMount = function () {
        var _this = this;
        this.loadDb(function () { return _this.syncIn(); });
    };
    CityPicker.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        var props = this.props;
        if (props.value !== prevProps.value) {
            this.loadDb(function () { return _this.syncIn(props); });
        }
    };
    CityPicker.prototype.loadDb = function (callback) {
        var _this = this;
        if (this.state.db) {
            callback === null || callback === void 0 ? void 0 : callback();
            return;
        }
        Promise.resolve().then(function () { return new Promise(function(resolve){require(['./CityDB'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (db) {
            _this.setState({
                db: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, db.default), { province: db.province, city: db.city, district: db.district })
            }, callback);
        });
        // require.ensure(['./CityDB'], (db: any) =>
        //   this.setState(
        //     {
        //       db: {
        //         ...db.default,
        //         province: db.province,
        //         city: db.city,
        //         district: db.district
        //       }
        //     },
        //     callback
        //   )
        // );
    };
    CityPicker.prototype.handleProvinceChange = function (option) {
        this.setState({
            province: option.label,
            provinceCode: option.value,
            city: '',
            cityCode: 0,
            district: '',
            districtCode: 0,
            street: '',
            code: option.value
        }, this.syncOut);
    };
    CityPicker.prototype.handleCityChange = function (option) {
        if (option.value % 100) {
            return this.handleDistrictChange(option, {
                cityCode: option.value
            });
        }
        this.setState({
            city: option.label,
            cityCode: option.value,
            district: '',
            districtCode: 0,
            street: '',
            code: option.value
        }, this.syncOut);
    };
    CityPicker.prototype.handleDistrictChange = function (option, otherStates) {
        if (otherStates === void 0) { otherStates = {}; }
        this.setState((0, tslib_1.__assign)((0, tslib_1.__assign)({}, otherStates), { district: option.label, districtCode: option.value, street: '', code: option.value }), this.syncOut);
    };
    CityPicker.prototype.handleStreetChange = function (e) {
        this.setState({
            street: e.currentTarget.value
        });
    };
    CityPicker.prototype.handleStreetEnd = function () {
        this.syncOut();
    };
    CityPicker.prototype.syncIn = function (props) {
        var _a;
        if (props === void 0) { props = this.props; }
        var db = this.state.db;
        var value = props.value, delimiter = props.delimiter;
        if (!db) {
            return;
        }
        var state = {
            code: 0,
            province: '',
            provinceCode: 0,
            city: '',
            cityCode: 0,
            district: '',
            districtCode: 0,
            street: ''
        };
        var code = (value && value.code) ||
            (typeof value === 'number' && value) ||
            (typeof value === 'string' && /(\d{6})/.test(value) && RegExp.$1);
        if (code && db[code]) {
            code = parseInt(code, 10);
            state.code = code;
            var provinceCode = code - (code % 10000);
            if (db[provinceCode]) {
                state.provinceCode = provinceCode;
                state.province = db[provinceCode];
            }
            var cityCode = code - (code % 100);
            if (db[cityCode]) {
                state.cityCode = cityCode;
                state.city = db[cityCode];
            }
            else if (~((_a = db.city[provinceCode]) === null || _a === void 0 ? void 0 : _a.indexOf(code))) {
                state.cityCode = code;
                state.city = db[code];
            }
            if (code % 100) {
                state.district = db[code];
                state.districtCode = code;
            }
        }
        else if (value) {
            // todo 模糊查找
        }
        if (value && value.street) {
            state.street = value.street;
        }
        else if (typeof value === 'string' && ~value.indexOf(delimiter)) {
            state.street = value.slice(value.indexOf(delimiter) + delimiter.length);
        }
        this.setState(state);
    };
    CityPicker.prototype.syncOut = function () {
        var _a = this.props, onChange = _a.onChange, allowStreet = _a.allowStreet, joinValues = _a.joinValues, extractValue = _a.extractValue, delimiter = _a.delimiter;
        var _b = this.state, code = _b.code, province = _b.province, city = _b.city, district = _b.district, street = _b.street;
        if (typeof extractValue === 'undefined' ? joinValues : extractValue) {
            code
                ? onChange(allowStreet && street
                    ? [code, street].join(delimiter)
                    : String(code))
                : onChange('');
        }
        else {
            onChange({
                code: code,
                province: province,
                city: city,
                district: district,
                street: street
            });
        }
    };
    CityPicker.prototype.render = function () {
        var _a, _b;
        var _c = this.props, cx = _c.classnames, className = _c.className, disabled = _c.disabled, allowCity = _c.allowCity, allowDistrict = _c.allowDistrict, allowStreet = _c.allowStreet, searchable = _c.searchable, __ = _c.translate;
        var _d = this.state, provinceCode = _d.provinceCode, cityCode = _d.cityCode, districtCode = _d.districtCode, street = _d.street, db = _d.db;
        return db ? (react_1.default.createElement("div", { className: cx('CityPicker', className) },
            react_1.default.createElement(components_1.Select, { searchable: searchable, disabled: disabled, options: db.province.map(function (item) { return ({
                    label: db[item],
                    value: item
                }); }), value: provinceCode, onChange: this.handleProvinceChange }),
            provinceCode &&
                allowDistrict &&
                Array.isArray(db.district[provinceCode]) ? (react_1.default.createElement(components_1.Select, { searchable: searchable, disabled: disabled, options: db.district[provinceCode].map(function (item) { return ({
                    label: db[item],
                    value: item
                }); }), value: districtCode, onChange: this.handleDistrictChange })) : allowCity &&
                db.city[provinceCode] &&
                db.city[provinceCode].length ? (react_1.default.createElement(components_1.Select, { searchable: searchable, disabled: disabled, options: db.city[provinceCode].map(function (item) { return ({
                    label: db[item],
                    value: item
                }); }), value: cityCode, onChange: this.handleCityChange })) : null,
            cityCode &&
                allowDistrict &&
                ((_b = (_a = db.district[provinceCode]) === null || _a === void 0 ? void 0 : _a[cityCode]) === null || _b === void 0 ? void 0 : _b.length) ? (react_1.default.createElement(components_1.Select, { searchable: searchable, disabled: disabled, options: db.district[provinceCode][cityCode].map(function (item) { return ({
                    label: db[item],
                    value: item
                }); }), value: districtCode, onChange: this.handleDistrictChange })) : null,
            allowStreet && provinceCode ? (react_1.default.createElement("input", { className: cx('CityPicker-input'), value: street, onChange: this.handleStreetChange, onBlur: this.handleStreetEnd, placeholder: __('City.street'), disabled: disabled })) : null)) : (react_1.default.createElement(components_1.Spinner, { show: true, size: "sm" }));
    };
    var _a, _b, _c, _d, _e;
    CityPicker.defaultProps = {
        joinValues: true,
        extractValue: true,
        delimiter: ',',
        allowCity: true,
        allowDistrict: true,
        allowStreet: false
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CityPicker.prototype, "handleProvinceChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CityPicker.prototype, "handleCityChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof Options_1.Option !== "undefined" && Options_1.Option) === "function" ? _c : Object, typeof (_d = typeof Partial !== "undefined" && Partial) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CityPicker.prototype, "handleDistrictChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _e : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CityPicker.prototype, "handleStreetChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CityPicker.prototype, "handleStreetEnd", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CityPicker.prototype, "syncIn", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], CityPicker.prototype, "syncOut", null);
    return CityPicker;
}(react_1.default.Component));
exports.CityPicker = CityPicker;
var ThemedCity = (0, theme_1.themeable)((0, locale_1.localeable)(CityPicker));
exports.default = ThemedCity;
var LocationControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LocationControl, _super);
    function LocationControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocationControl.prototype.render = function () {
        var _a = this.props, value = _a.value, onChange = _a.onChange, allowCity = _a.allowCity, allowDistrict = _a.allowDistrict, extractValue = _a.extractValue, joinValues = _a.joinValues, allowStreet = _a.allowStreet, disabled = _a.disabled, searchable = _a.searchable;
        return (react_1.default.createElement(ThemedCity, { searchable: searchable, value: value, onChange: onChange, allowCity: allowCity, allowDistrict: allowDistrict, extractValue: extractValue, joinValues: joinValues, allowStreet: allowStreet, disabled: disabled }));
    };
    return LocationControl;
}(react_1.default.Component));
exports.LocationControl = LocationControl;
var CheckboxControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CheckboxControlRenderer, _super);
    function CheckboxControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'input-city',
            sizeMutable: false
        })
    ], CheckboxControlRenderer);
    return CheckboxControlRenderer;
}(LocationControl));
exports.CheckboxControlRenderer = CheckboxControlRenderer;
//# sourceMappingURL=./renderers/Form/InputCity.js.map
