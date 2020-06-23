type DiffObject<T extends { [key: string]: any }> = {
  [K in keyof T]?: [T[K] | undefined, T[K] | undefined]
}

export function diff<T = { [key: string]: any }>(
  checkObject?: T | undefined,
  comparisonObjet?: T | undefined
) {
  const diffObject = {} as DiffObject<T>

  if (checkObject !== comparisonObjet) {
    if (checkObject) {
      const checkObjectKey = Object.keys(checkObject) as (keyof T)[]
      if (comparisonObjet) {
        const comparisonObjetKey = Object.keys(comparisonObjet) as (keyof T)[]
        const keys: Set<keyof T> = new Set([
          ...checkObjectKey,
          ...comparisonObjetKey
        ])

        for (const key of keys) {
          const checkObjetValue = checkObject[key]
          const comparisonObjetValue = comparisonObjet[key]
          if (checkObjetValue === comparisonObjetValue) {
            continue
          }

          diffObject[key] = [checkObjetValue, comparisonObjetValue]
        }
      } else {
        for (const key of checkObjectKey) {
          const value = checkObject[key]
          diffObject[key] = [value, undefined]
        }
      }
    } else {
      if (comparisonObjet) {
        const comparisonObjetKey = Object.keys(comparisonObjet) as (keyof T)[]
        for (const key of comparisonObjetKey) {
          const value = comparisonObjet[key]
          diffObject[key] = [undefined, value]
        }
      }
    }
  }

  return diffObject
}
