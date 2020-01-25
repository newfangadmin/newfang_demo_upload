import Cookies from 'js-cookie'

const pvt_key = 'temp'

export function getPvtKey() {
  return Cookies.get(pvt_key)
}

export function setPvtKey(pvt_key) {
  return Cookies.set(pvt_key, pvt_key)
}

export function removePvtKey() {
  return Cookies.remove(pvt_key)
}