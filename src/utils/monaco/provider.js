import i18n from '@/i18n'

export function translateTitle(title) {
  let pageTitle = ''
  if (i18n.te(`dgiotI18n.${title}`)) {
    pageTitle = i18n.t(`dgiotI18n.${title}`)
  } else {
    pageTitle = title.substr(title.lastIndexOf('.') + 1)
  }
  return pageTitle
}

export const ruleEngineProvider = [
  {
    name: 'clientid',
    documentation: translateTitle('rule.clientid_doc'),
    type: 'Field',
    default: 'c_emqx',
    valueType: 'string',
  },
  {
    name: 'username',
    documentation: translateTitle('rule.username_doc'),
    type: 'Field',
    default: 'u_emqx',
    valueType: 'string',
  },
  {
    name: 'event',
    documentation: translateTitle('rule.event_doc'),
    type: 'Field',
    default: 'disconnect',
    valueType: 'string',
  },
  {
    name: 'id',
    documentation: translateTitle('rule.id_doc'),
    type: 'Field',
    default: '--',
    valueType: 'string',
  },
  {
    name: 'payload',
    documentation: translateTitle('rule.payload_doc'),
    type: 'Field',
    default: '{"msg": "hello"}',
    valueType: 'string',
  },
  {
    name: 'peername',
    documentation: translateTitle('rule.peername_doc'),
    type: 'Field',
    default: '127.0.0.1:63412',
    valueType: 'string',
  },
  {
    name: 'qos',
    documentation: translateTitle('rule.qos_doc'),
    type: 'Field',
    default: 1,
    valueType: 'integer',
  },
  {
    name: 'timestamp',
    documentation: translateTitle('rule.timestamp_doc'),
    type: 'Field',
    default: 1576549961086,
    valueType: 'integer',
  },
  {
    name: 'topic',
    documentation: translateTitle('rule.topic_doc'),
    type: 'Field',
    default: 't/a',
    valueType: 'string',
  },
  {
    name: 'node',
    documentation: translateTitle('rule.node_doc'),
    type: 'Field',
    default: 'emqx@127.0.0.1',
    valueType: 'string',
  },
  {
    name: '"$events/message_delivered"',
    documentation: translateTitle('rule.message_delivered'),
    type: 'Method',
  },
  {
    name: '"$events/message_acked"',
    documentation: translateTitle('rule.message_acked'),
    type: 'Method',
  },
  {
    name: '"$events/message_dropped"',
    documentation: translateTitle('rule.message_dropped'),
    type: 'Method',
  },
  {
    name: '"$events/client_connected"',
    documentation: translateTitle('rule.client_connected'),
    type: 'Method',
  },
  {
    name: '"$events/client_disconnected"',
    documentation: translateTitle('rule.client_disconnected'),
    type: 'Method',
  },
  {
    name: '"$events/session_subscribed"',
    documentation: translateTitle('rule.session_subscribed'),
    type: 'Method',
  },
  {
    name: '"$events/session_unsubscribed"',
    documentation: translateTitle('rule.session_unsubscribed'),
    type: 'Method',
  },
]

export default []
