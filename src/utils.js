export const aggregate = (data) => {
  const a = data.reduce((memo, c) => {
    c.items.forEach((item, index) => {
      memo[item.artist] = memo[item.artist] || {}
      memo[item.artist][item.title] = memo[item.artist][item.title] || {
        url: item.url,
        img_url: item.img_url,
        label: item.label,
        genre: item.genre,
        chart_by: {}
      }
      memo[item.artist][item.title].chart_by[c.chart_by] = index + 1
    })

    return memo
  }, {})

  const items = []
  for (const [artist, titles] of Object.entries(a)) {
    for (const [title, value] of Object.entries(titles)) {
      items.push({
        artist: artist,
        title: title,
        url: value.url,
        img_url: value.img_url,
        label: value.label,
        genre: value.genre,
        chart_by: value.chart_by,
        score: Object.entries(value.chart_by).reduce((total, v) => {
          return total + 1 + (1.0 / (v[1] * 5))
        }, 0)
      })
    }
  }

  items.sort((a, b) => {
    return b.score - a.score
  })

  return items
}
