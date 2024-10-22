interface SyncStore {
  api: string
  data: object
}
export const  SyncStore: SyncStore = {
  api: process.env.SYNC_STORE_URL + '/getHost',
  data: {"title": "all"}
}