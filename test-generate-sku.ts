type Variant = {
  value: string
  options: string[]
}

type SKU = {
  value: string
  price: number
  stock: number
  image: string
}

type SentFromClientData = {
  product: {
    publishedAt: string | null // ISO date string
    name: string
    basePrice: number
    virtualPrice: number
    brandId: number
    images: string[]
    variants: Variant[]
    categories: number[] // List of category ids
  }
  skus: SKU[]
}

const data: SentFromClientData = {
  product: {
    publishedAt: new Date().toISOString(),
    name: 'Sản phẩm mẫu',
    basePrice: 100000,
    virtualPrice: 100000,
    brandId: 1,
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
    categories: [1, 2, 3],
    variants: [
      {
        value: 'color',
        options: ['Black', 'White'],
      },
      {
        value: 'size',
        options: ['36', '37', '38', '39', '40'],
      },
    ],
  },
  skus: [],
}

/**
 * Tạo ra tất cả các tổ hợp chuỗi có thể
 * @param variants
 */
const generateSKUs = (variants: Variant[]): SKU[] => {
  const generateCombinations = (values: string[][]): string[] => {
    let result: string[] = ['']

    for (const group of values) {
      const temp: string[] = []

      for (const prefix of result) {
        for (const item of group) {
          temp.push(prefix ? `${prefix}-${item}` : item)
        }
      }

      result = temp
    }

    return result
  }

  const options: string[][] = variants.map((item) => item.options)
  const combinations = generateCombinations(options)

  const withDefaultValueSkus: SKU[] = combinations.map((value) => ({
    value,
    image: '',
    price: 1,
    stock: 100,
  }))

  return withDefaultValueSkus
}

data.skus = generateSKUs(data.product.variants)
// console.log(data)
console.log('>>> Copy this: ', JSON.stringify(data.skus))
