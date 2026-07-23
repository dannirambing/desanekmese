export function formatRupiah(price: number) {
  const formattedVal = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return `Rp${formattedVal}`;
}

