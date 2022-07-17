export type FilterTypes = 'artist' | 'title' | 'label' | 'genre' | 'chartBy'
export type AppState = {
  artistFilter: string
  genreFilter: string
  labelFilter: string
  titleFilter: string
  chartByFilter: string
  offset: number
}
export type ChartItem = {
  artist: string
  title: string
  url: string | null
  img_url: string
  label: string
  genre: string
  chart_by: Record<string, number>
  score: number
}
