const VISITOR_ID_KEY = 'coco_tap_visitor_id'
const SESSION_ID_KEY = 'coco_tap_session_id'

function getOrCreateId(storage, key) {
  try {
    let id = storage.getItem(key)
    if (!id) {
      id = crypto.randomUUID()
      storage.setItem(key, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

/** Persistent ID for this browser/device (localStorage). */
export function getVisitorId() {
  return getOrCreateId(localStorage, VISITOR_ID_KEY)
}

/** Session ID for this tab (sessionStorage). New tab = new session. */
export function getSessionId() {
  return getOrCreateId(sessionStorage, SESSION_ID_KEY)
}
