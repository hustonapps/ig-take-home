import fs from "fs/promises";

// master list of competitors
const COMPETITORS = {
  TRUE_CLASSIC: { key: "trueClassic", name: "True Classic", products: [] },
  ME_UNDIES: { key: "meUndies", name: "Me Undies", products: [] },
  ADIDAS: { key: "adidas", name: "Adidas", products: [] },
};

const getTrueClassic = async () => {
  try {
    const trueClassicResults = await fetch(
      "https://www.trueclassictees.com/products/white-short-classic-crew-neck.json",
    );
    const result = await trueClassicResults.json();
    return result?.product ?? undefined;
  } catch (e) {
    console.error("Error getting True Classic", e);
  }
};

const getMeUndies = async () => {
  const query = `
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }`;

  try {
    const meUndiesResults = await fetch(
      "https://meundies-production-store.myshopify.com/api/2026-10/graphql.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            "a3197c3d9bec03f7b8a634f851c16882", // normally would not store this here
        },
        body: JSON.stringify({
          query,
          variables: {
            handle: "new-mens-modal-crew-tee-white",
          },
        }),
      },
    );
    const result = await meUndiesResults.json();
    return result?.data?.product ?? undefined;
  } catch (e) {
    console.error("Error getting Me Undies", e);
  }
};

const getAdidas = async () => {
  try {
    const results = await fetch(
      "https://www.adidas.com/api/product-list/IA4846",
    );
    const data = await results.json();
    return data?.[0] ?? undefined;
  } catch (e) {
    console.error("Error getting Adidas", e);
  }
};

const saveRawProductData = async (data, key) => {
  // write local to confirm
  try {
    await fs.writeFile(`./app/${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving raw product data locally", e);
  }
};

const addCompetitor = async (catalog, competitor) => {
  catalog.competitors.push({
    ...competitor,
    name: competitor.name,
    products: [...(competitor?.products ?? [])],
  });
  return catalog;
};

const addCompetitorProduct = async (
  catalog,
  competitor,
  category,
  getProductData,
) => {
  const productData = await getProductData();
  catalog.competitors
    .find((c) => c.key === competitor.key)
    .products.push({
      category,
      ...productData,
    });
  return catalog;
};

// const getRawProductData = async () => {
//   const [trueClassic, meUndies, adidas] = await Promise.all([
//     getTrueClassic(),
//     getMeUndies(),
//     getAdidas(),
//   ]);

//   const catalog = {};

//   addCompetitorData("mens-t-shirts", "trueClassic", trueClassic.product);
//   addCompetitorData("mens-t-shirts", "meUndies", meUndies.data.product);
//   addCompetitorData("mens-t-shirts", "adidas", adidas[0]);

//   await saveRawProductData("data.json");
// };

const buildData = async () => {
  const catalog = {
    competitors: [],
  };

  Object.values(COMPETITORS).map((competitor) => {
    return addCompetitor(catalog, competitor);
  });

  // quick and dirty way to get product data for now
  await addCompetitorProduct(
    catalog,
    COMPETITORS.TRUE_CLASSIC,
    "mens-t-shirts",
    getTrueClassic,
  );
  await addCompetitorProduct(
    catalog,
    COMPETITORS.ME_UNDIES,
    "mens-t-shirts",
    getMeUndies,
  );
  await addCompetitorProduct(
    catalog,
    COMPETITORS.ADIDAS,
    "mens-t-shirts",
    getAdidas,
  );

  await saveRawProductData(catalog, "data.json");
};

await buildData();
