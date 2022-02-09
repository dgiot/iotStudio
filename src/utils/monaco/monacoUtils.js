/**
 * @topo 汉化放出当前说明下的第一行注释
 * @param text
 * @param preWord
 * @returns {*}
 */
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

// eslint-disable-next-line no-unused-vars
function getInertText(text, preWord) {
  // let $text = text.replace(/\"/g, '')
  return text
}

export function createMonacoComplete(hints, range, { word }) {
  let customHints = []
  if (hints.length) {
    customHints = hints.map((doc) => ({
      label: doc.name,
      // kind is icon
      kind: doc.type
        ? monaco.languages.CompletionItemKind[doc.type]
        : monaco.languages.CompletionItemKind.Function,
      documentation: doc.documentation,
      insertText: getInertText(doc.name, word),
      detail: doc.detail || 'EMQX',
      range,
    }))
  }
  return customHints
}

function getValueName(hint) {
  // eslint-disable-next-line prefer-const
  let { name, default: defaultValue, valueType } = hint
  if (valueType) {
    name = `${name}: ${valueType}`
  }
  return defaultValue ? `${name}, value: ${defaultValue}` : name
}

export function createMonacoHover(key, hints) {
  const contents = []
  hints.forEach((hint) => {
    let word = hint.name
    if (hint.name.match(/\$events\//)) {
      word = hint.name.split('/')[1].replace('"', '')
    }
    if (key === word) {
      contents.push(
        {
          value: getValueName(hint),
        },
        {
          value: hint.documentation,
        }
      )
    }
  })
  return contents
}

export default {}
