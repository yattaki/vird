export function diff<T = { [key: string]: any }> (checkObject?: T, comparisonObjet?: T) {
  const diffObject: { [key: string]: [T[keyof T] | undefined, T[keyof T] | undefined] } = {}

  if (checkObject !== comparisonObjet) {
    if (checkObject) {
      if (comparisonObjet) {
        const checkObjectKeys = Object.keys(checkObject)
        const comparisonObjetKeys = Object.keys(comparisonObjet)

        const keys = new Set([
          ...checkObjectKeys,
          ...comparisonObjetKeys
        ]) as Set<Extract<keyof T, string>>

        for (const key of keys) {
          const checkObjetValue = checkObject[key]
          const comparisonObjetValue = comparisonObjet[key]
          if (checkObjetValue === comparisonObjetValue) { continue }

          diffObject[key] = [checkObjetValue, comparisonObjetValue]
        }
      } else {
        for (const key of Object.keys(checkObject)) {
          const value = checkObject[key as keyof T]
          diffObject[key] = [value, undefined]
        }
      }
    } else {
      if (comparisonObjet) {
        for (const key of Object.keys(comparisonObjet)) {
          const value = comparisonObjet[key as keyof T]
          diffObject[key] = [undefined, value]
        }
      }
    }
  }

  return diffObject as { [K in keyof T]: [T[K] | undefined, T[K] | undefined] }
}
