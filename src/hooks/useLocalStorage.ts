// from https://dev.to/devlargs/nextjs-hook-for-accessing-local-or-session-storage-variables-3n0

type StorageType = 'session' | 'local'
type UseStorageReturnValue = {
  getItem: (key: string, type?: StorageType) => string
  setItem: (key: string, value: string, type?: StorageType) => boolean
  removeItem: (key: string, type?: StorageType) => void
}

const storageType = (type?: StorageType): 'localStorage' | 'sessionStorage' => {
  return `${type ?? 'session'}Storage`
}

const removeItem = (key: string, type?: StorageType): void => {
  window[storageType(type)].removeItem(key)
}

export const useStorage = (): UseStorageReturnValue => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()

  const getItem = (key: string, type?: StorageType): string => {
    return isBrowser ? window[storageType(type)][key] : ''
  }

  const setItem = (key: string, value: string, type?: StorageType): boolean => {
    if (isBrowser) {
      window[storageType(type)].setItem(key, value)
      return true
    }

    return false
  }

  return {
    getItem,
    setItem,
    removeItem,
  }
}
