/** Channel API — iotStudio 标准封装 */
import { query_object, get_object, del_object, update_object, create_object } from '../parse'
export const queryChannel = (p) => query_object('Channel', p)
export const getChannel = (id) => get_object('Channel', id)
export const delChannel = (id) => del_object('Channel', id)
export const putChannel = (id, d) => update_object('Channel', id, d)
export const postChannel = (d) => create_object('Channel', d)
