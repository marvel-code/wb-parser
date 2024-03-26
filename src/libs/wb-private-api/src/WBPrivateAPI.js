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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
var format = require("string-format");
var Constants = require("./Constants");
var WBProduct = require("./WBProduct");
var Utils = require("./Utils");
var WBCatalog = require("./WBCatalog");
var SessionBuilder = require("./SessionBuilder");
format.extend(String.prototype, {});
var WBPrivateAPI = /** @class */ (function () {
    /* Creating a new instance of the class WBPrivateAPI. */
    function WBPrivateAPI(_a) {
        var destination = _a.destination;
        this.session = SessionBuilder.create();
        this.destination = destination;
    }
    /**
     * It searches for products by keyword.
     * @param {string} keyword - The keyword to search for
     * @param {number} pageCount - Number of pages to retrieve
     * @returns {WBCatalog} WBCatalog objects with WBProducts inside it
     */
    WBPrivateAPI.prototype.search = function (keyword_1) {
        return __awaiter(this, arguments, void 0, function (keyword, pageCount, retries, filters) {
            var products, totalProducts, _a, catalog_type, catalog_value, catalogConfig, totalPages, threads, parsedPages;
            var _this = this;
            if (pageCount === void 0) { pageCount = 0; }
            if (retries === void 0) { retries = 0; }
            if (filters === void 0) { filters = []; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        products = [];
                        return [4 /*yield*/, this.searchTotalProducts(keyword)];
                    case 1:
                        totalProducts = _b.sent();
                        if (totalProducts === 0)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.getQueryMetadata(keyword, 0, false, 1, retries)];
                    case 2:
                        _a = _b.sent(), catalog_type = _a.catalog_type, catalog_value = _a.catalog_value;
                        catalogConfig = { keyword: keyword, catalog_type: catalog_type, catalog_value: catalog_value };
                        totalPages = Math.round(totalProducts / 100 + 0.5);
                        if (totalPages > Constants.PAGES_PER_CATALOG) {
                            totalPages = Constants.PAGES_PER_CATALOG;
                        }
                        if (pageCount > 0) {
                            if (pageCount < totalPages) {
                                totalPages = pageCount;
                            }
                        }
                        threads = Array(totalPages)
                            .fill(1)
                            .map(function (x, y) { return x + y; });
                        return [4 /*yield*/, Promise.all(threads.map(function (thr) {
                                return _this.getCatalogPage(catalogConfig, thr, retries, filters);
                            }))];
                    case 3:
                        parsedPages = _b.sent();
                        parsedPages.map(function (val) {
                            if (Array.isArray(val)) {
                                val.map(function (v) { return products.push(new WBProduct(v)); });
                            }
                        });
                        Object.assign(catalogConfig, {
                            pages: totalPages,
                            products: products,
                            totalProducts: totalProducts,
                        });
                        return [2 /*return*/, new WBCatalog(catalogConfig)];
                }
            });
        });
    };
    /**
     * It takes a keyword and returns an array of three elements,
     * shardKey, preset and preset value
     * @param {string} keyword - The keyword you want to search for.
     * @returns {array} - An array of shardKey, preset and preset value
     */
    WBPrivateAPI.prototype.getQueryMetadata = function (keyword_1) {
        return __awaiter(this, arguments, void 0, function (keyword, limit, withProducts, page, retries, suppressSpellcheck) {
            var params, res;
            var _a, _b, _c, _d, _e, _f, _g;
            if (limit === void 0) { limit = 0; }
            if (withProducts === void 0) { withProducts = false; }
            if (page === void 0) { page = 1; }
            if (retries === void 0) { retries = 0; }
            if (suppressSpellcheck === void 0) { suppressSpellcheck = true; }
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        params = {
                            appType: Constants.APPTYPES.DESKTOP,
                            curr: "rub",
                            dest: this.destination.ids[0],
                            query: keyword,
                            resultset: "catalog",
                            sort: "popular",
                            spp: 30,
                            suppressSpellcheck: suppressSpellcheck,
                        };
                        if (page !== 1) {
                            params.page = page;
                        }
                        if (limit !== 100) {
                            params.limit = limit;
                        }
                        return [4 /*yield*/, this.session.get(Constants.URLS.SEARCH.EXACTMATCH, {
                                params: params,
                                headers: {
                                    "x-queryid": Utils.Search.getQueryIdForSearch(),
                                },
                                "axios-retry": {
                                    retries: retries,
                                    retryCondition: function (error) {
                                        return error.response.status === 429 || error.response.status >= 500;
                                    },
                                },
                            })];
                    case 1:
                        res = _h.sent();
                        if (((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.hasOwnProperty("catalog_type")) &&
                            ((_d = (_c = res.data) === null || _c === void 0 ? void 0 : _c.metadata) === null || _d === void 0 ? void 0 : _d.hasOwnProperty("catalog_value"))) {
                            return [2 /*return*/, __assign(__assign({}, res.data.metadata), { products: (_e = res.data.data) === null || _e === void 0 ? void 0 : _e.products })];
                        }
                        if (((_f = res.data) === null || _f === void 0 ? void 0 : _f.hasOwnProperty("shardKey")) &&
                            ((_g = res.data) === null || _g === void 0 ? void 0 : _g.hasOwnProperty("query"))) {
                            return [2 /*return*/, {
                                    catalog_type: res.data.shardKey,
                                    catalog_value: res.data.query,
                                    products: [],
                                }];
                        }
                        return [2 /*return*/, { catalog_type: null, catalog_value: null, products: [] }];
                }
            });
        });
    };
    /**
     * It returns the total number of products for a given keyword
     * @param {string} keyword - the search query
     * @returns Total number of products
     */
    WBPrivateAPI.prototype.searchTotalProducts = function (keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.session.get(Constants.URLS.SEARCH.TOTALPRODUCTS, {
                            params: {
                                appType: Constants.APPTYPES.DESKTOP,
                                query: keyword,
                                curr: Constants.CURRENCIES.RUB,
                                dest: this.destination.ids[0],
                                regions: this.destination.regions,
                                locale: Constants.LOCALES.RU,
                                resultset: "filters",
                            },
                            headers: {
                                "x-queryid": Utils.Search.getQueryIdForSearch(),
                            },
                        })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, ((_a = res.data.data) === null || _a === void 0 ? void 0 : _a.total) || 0];
                }
            });
        });
    };
    /**
     * It returns the data based on filters array
     * @param {string} keyword - the search query
     * @param {array} filters - array of filters elements like [`fbrand','fsupplier']
     * @returns Total number of products
     */
    WBPrivateAPI.prototype.searchCustomFilters = function (keyword, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.session.get(Constants.URLS.SEARCH.EXACTMATCH, {
                            params: {
                                appType: Constants.APPTYPES.DESKTOP,
                                curr: Constants.CURRENCIES.RUB,
                                dest: this.destination.ids,
                                query: keyword,
                                resultset: "filters",
                                filters: filters.join(";"),
                            },
                            headers: {
                                "x-queryid": Utils.Search.getQueryIdForSearch(),
                            },
                        })];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, ((_a = res.data) === null || _a === void 0 ? void 0 : _a.data) || {}];
                }
            });
        });
    };
    /**
     * It gets all products from specified page
     * @param {object} catalogConfig - { shradKey, query }
     * @param {number} page - page number
     * @returns {array} - An array of products
     */
    WBPrivateAPI.prototype.getCatalogPage = function (catalogConfig_1) {
        return __awaiter(this, arguments, void 0, function (catalogConfig, page, retries, filters) {
            var _this = this;
            if (page === void 0) { page = 1; }
            if (retries === void 0) { retries = 0; }
            if (filters === void 0) { filters = []; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var foundProducts, options, _i, filters_1, filter, url, res, err_1;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    options = {
                                        params: {
                                            appType: Constants.APPTYPES.DESKTOP,
                                            curr: "rub",
                                            dest: this.destination.ids[0],
                                            query: catalogConfig.keyword.toLowerCase(),
                                            resultset: "catalog",
                                            sort: "popular",
                                            spp: 30,
                                            suppressSpellcheck: false,
                                        },
                                        headers: {
                                            "x-queryid": Utils.Search.getQueryIdForSearch(),
                                            referrer: "https://www.wildberries.ru/catalog/0/search.aspx?page=2&sort=popular&search=" +
                                                encodeURI(catalogConfig.keyword.toLowerCase()),
                                        },
                                    };
                                    if (page !== 1) {
                                        options.params.page = page;
                                    }
                                    for (_i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
                                        filter = filters_1[_i];
                                        options.params[filter["type"]] = filter["value"];
                                    }
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    url = Constants.URLS.SEARCH.EXACTMATCH;
                                    return [4 /*yield*/, this.session.get(url, options)];
                                case 2:
                                    res = _c.sent();
                                    if (res.status === 429 || res.status === 500) {
                                        throw new Error("BAD STATUS");
                                    }
                                    if (((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.catalog_value) === "preset=11111111") {
                                        throw new Error("BAD CATALOG VALUE - 11111111");
                                    }
                                    foundProducts = res.data.data.products;
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _c.sent();
                                    throw new Error(err_1);
                                case 4:
                                    resolve(foundProducts);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Search for adverts and their ads form specified keyword
     * @param {string} keyword - the search query
     * @returns {object} - An object with adverts and their ads
     */
    WBPrivateAPI.prototype.getSearchAds = function (keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var options, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = { params: { keyword: keyword } };
                        return [4 /*yield*/, this.session.get(Constants.URLS.SEARCH.ADS, options)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    /**
     * Search for carousel ads inside product card
     * @param {number} productId - product id
     * @returns {array} - An array with ads
     */
    WBPrivateAPI.prototype.getCarouselAds = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var options, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            params: {
                                nm: productId,
                            },
                        };
                        return [4 /*yield*/, this.session.get(Constants.URLS.SEARCH.CAROUSEL_ADS, options)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    /**
     * It takes a query string and returns a list of suggestions that match the query
     * @param {string} query - the search query
     * @returns {array} - An array of objects.
     */
    WBPrivateAPI.prototype.keyHint = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var options, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            params: {
                                query: query,
                                gender: Constants.SEX.FEMALE,
                                locale: Constants.LOCALES.RU,
                            },
                        };
                        return [4 /*yield*/, this.session.get(Constants.URLS.SEARCH.HINT, options)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    /**
     * It takes a productId, makes a request to the server, and returns the similar Ids
     * @param productId - The product ID of the product you want to search for similar
     * @returns {object} with similar product Ids
     */
    WBPrivateAPI.prototype.searchSimilarByNm = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var options, url, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            params: { nm: productId },
                        };
                        url = Constants.URLS.SEARCH.SIMILAR_BY_NM;
                        return [4 /*yield*/, this.session.get(url, options)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    /**
     * It takes an array of productIds and a destination, and returns an array of
     * products with delivery time data
     * @param config - { productIds, dest }
     * @returns {object} of products with delivety times
     */
    WBPrivateAPI.prototype.getDeliveryDataByNms = function (productIds_1) {
        return __awaiter(this, arguments, void 0, function (productIds, retries) {
            var _this = this;
            if (retries === void 0) { retries = 0; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var options, url, res, foundProducts, err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    options = {
                                        params: {
                                            appType: Constants.APPTYPES.DESKTOP,
                                            locale: Constants.LOCALES.RU,
                                            dest: this.destination.ids,
                                            nm: productIds.join(";"),
                                        },
                                    };
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    url = Constants.URLS.PRODUCT.DELIVERYDATA;
                                    return [4 /*yield*/, this.session.get(url, __assign(__assign({}, options), { "axios-retry": {
                                                retries: retries,
                                            } }))];
                                case 2:
                                    res = _a.sent();
                                    foundProducts = res.data.data.products;
                                    resolve(foundProducts);
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_2 = _a.sent();
                                    throw new Error(err_2);
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * @returns Array of promos
     */
    WBPrivateAPI.prototype.getPromos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.session.get(Constants.URLS.PROMOS)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.data];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, console.log(e_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @returns Array of found products
     */
    WBPrivateAPI.prototype.getListOfProducts = function (productIds) {
        return __awaiter(this, void 0, void 0, function () {
            var options, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            params: {
                                nm: productIds.join(";"),
                                appType: Constants.APPTYPES.DESKTOP,
                                dest: this.destination.ids[0],
                            },
                        };
                        return [4 /*yield*/, this.session.get(Constants.URLS.SEARCH.LIST, options)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.data.products || []];
                }
            });
        });
    };
    /**
     * @returns Object with supplier info
     */
    WBPrivateAPI.prototype.getSupplierInfo = function (sellerId) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session.get(Constants.URLS.SUPPLIER.INFO.format(sellerId))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data || {}];
                }
            });
        });
    };
    return WBPrivateAPI;
}());
module.exports = WBPrivateAPI;
//# sourceMappingURL=WBPrivateAPI.js.map