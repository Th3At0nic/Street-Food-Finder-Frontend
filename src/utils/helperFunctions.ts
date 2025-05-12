export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "symbol",
  })
    .format(price)
    .replace("BDT", "৳");
};
