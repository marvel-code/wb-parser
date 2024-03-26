/* eslint-disable no-undef */
const Constants = require("../../src/Constants");
const WBPrivateAPI = require("../../src/WBPrivateAPI");

const wbapi = new WBPrivateAPI({
  destination: Constants.DESTINATIONS.MOSCOW,
});

describe("Проверка класса WBCatalog", () => {
  test(
    'Проверка метода .page() по ключевому запросу "Очки женские"',
    async () => {
      const catalog = await wbapi.search("Очки женские", 2);
      expect(catalog.page(2).length).toBe(100);
    },
    30 * 1000
  );

  test('Проверка метода .getPosition() по ключевому запросу "Менструальные чаши"', async () => {
    const catalog = await wbapi.search("Менструальные чаши", 2);
    {
      const sku = catalog.products[30].id;
      const position = catalog.getPosition(sku);
      expect(position).toBe(30);
    }

    {
      const sku = catalog.products[0].id;
      const position = catalog.getPosition(sku);
      expect(position).toBe(0);
    }
  });

  test("Проверка метода .getPosition() на ответ при ложном поиске", async () => {
    const catalog = await wbapi.search("Менструальные чаши", 3);
    const position = catalog.getPosition(0);
    expect(position).toBe(-1);
  });
});
