const productList = ["APPLE", "PEAR", "TOMATO", "POTATO", "ONION"];

export function isProduct(product: unknown): product is Product {
    return typeof product === "string" && productList.includes(product);
}