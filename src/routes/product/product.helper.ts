import { VariantType } from 'src/routes/product/product.model'

export const generateSKUs = (variants: VariantType[]) => {
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

  return combinations.map((value) => ({
    value,
    image: '',
    price: 0,
    stock: 100,
  }))
}
