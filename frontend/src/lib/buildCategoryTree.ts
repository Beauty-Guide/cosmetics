export function buildCategoryTree(categories) {
  const map = new Map()
  const roots = []

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] })
  })

  categories.forEach((cat) => {
    if (cat.parent?.id) {
      const parent = map.get(cat.parent.id)
      if (parent) {
        parent.children.push(map.get(cat.id))
      }
    } else {
      roots.push(map.get(cat.id))
    }
  })

  return roots
}
