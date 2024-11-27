import { ParamsUrl } from '../types'

export const normalizeARC0003IPSUrl = (arc0003Url: string) => {
  const paramsSplit = <ParamsUrl>{
    cid: arc0003Url.substring(7, 53),
    path: arc0003Url.substring(54, arc0003Url.length - 5),
  }

  return `/ipfs/${paramsSplit.cid}/${paramsSplit.path}`
}
