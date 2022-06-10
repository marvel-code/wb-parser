/* eslint-disable no-undef */
const WBPrivateAPI = require('../src/WBPrivateAPI');

const wbapi = new WBPrivateAPI();

describe('Проверка поиска рекламодателей WBPrivateAPI.searchAds()', () => {
  test('Присутствие не пустого свойства adverts', async () => {
    const ads = await wbapi.searchAds('Платье');
    expect(ads.adverts.length).toBeGreaterThan(0);
    expect(ads.prioritySubjects.length).toBeGreaterThan(0);
    expect(ads.adverts[0].cpm).toBeGreaterThan(0);
    expect(ads.pages.length).toBeGreaterThan(0);
  });
});

describe('Проверка поиска товаров WBPrivateAPI.search()', () => {
  test('Поиск количества товаров по ключевому слову "Платье"', async () => {
    const totalProducts = await wbapi.searchTotalProducts('Платье');
    expect(totalProducts).toBeGreaterThan(0);
  });

  test('Проверка получения Query Params по ключевому слову "Платье"', async () => {
    const queryParams = await wbapi._getQueryParams('Платье');
    const [shardKey, preset, presetValue] = queryParams;
    expect(Array.isArray(queryParams)).toBeTruthy();
    expect(shardKey).toBe('dresses');
    expect(preset).toBe('subject');
    expect(presetValue).toBe('69;70;2613;2905;4000;4855;4857');
  });

  test('Сбор 100 страниц товаров по ключевому слову "Платье"', async () => {
    const catalog = await wbapi.search('Платье', 3);
    expect(catalog.products.length).toBe(300);
  }, 30 * 1000);

  test('Проверка аргумента pageCount на понижение кол-ва страниц, если их меньше чем запрошено', async () => {
    const pageCount = 100;
    const catalog = await wbapi.search('Менструальные чаши', pageCount);
    expect(pageCount).toBeGreaterThan(catalog.pages);
  }, 30 * 1000);

  test('Проверка метода .getStocks() на возврат данных об остатках товара на складах', async () => {
    const catalog = await wbapi.search('Менструальные чаши', 1);
    const product = catalog.products[0];
    await wbapi.getStocks(product);
    expect(product.totalStocks).toBeGreaterThan(0);
  }, 30 * 1000);

  test('Проверка метода .getPromo() на возврат данных об участии в промо-акции', async () => {
    const catalog = await wbapi.search('Менструальные чаши', 1);
    const product = catalog.products[0];
    await wbapi.getPromo(product);
    expect(typeof product.promo.active === 'boolean').toBeTruthy();
  }, 30 * 1000);
});
