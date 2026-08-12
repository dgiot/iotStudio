/**
 * Device API — iotStudio 标准封装
 */
import { query_object, get_object, del_object, update_object, create_object } from '../parse'

export const queryDevice = (p) => query_object('Device', p)
export const getDevice = (id) => get_object('Device', id)
export const delDevice = (id) => del_object('Device', id)
export const putDevice = (id, d) => update_object('Device', id, d)
export const postDevice = (d) => create_object('Device', d)
