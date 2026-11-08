import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import fs from "fs/promises";

const BUCKET_NAME = "ig-mhuston-take-home-be-bucket";
const s3Client = new S3Client({ region: "us-east-1" });

/********************************************
 * Vendor-specific product GET functions
 *********************************************/

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

/********************************************
 * Helper functions
 *********************************************/

const saveRawProductData = async (data, key, local = false) => {
  try {
    // if (local) {
    //   // write local to confirm
    //   await fs.writeFile(`./app/${key}`, JSON.stringify(data));
    // } else {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(data),
        ContentType: "application/json",
      }),
    );
    console.log(`Uploaded https://ig-mhuston-take-home.intelligems.io/${key}`);
    // }
  } catch (e) {
    console.error("Error saving raw product data", e);
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
  // ... add more competitors here

  // save data
  await saveRawProductData(catalog, "data.json");
};

await buildData();
