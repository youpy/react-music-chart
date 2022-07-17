import { useState, useEffect } from 'react'
import qs from 'query-string'
import { Item, ChartItem } from './Item'
import { assign } from './utils'

type AppState = {
  artistFilter: string
  genreFilter: string
  labelFilter: string
  titleFilter: string
  chartByFilter: string
  offset: number
}

const initialState: AppState = {
  artistFilter: '',
  genreFilter: '',
  labelFilter: '',
  titleFilter: '',
  chartByFilter: '',
  offset: 50,
}

type Props = {
  title: string
  chart: ChartItem[]
}

function App({ title, chart }: Props) {
  const [appState, setAppState] = useState<AppState>(initialState)

  const chartBy = Object.keys(
    chart.reduce((memo, item) => {
      return Object.assign(memo, item.chart_by)
    }, {})
  ).sort()

  useEffect(() => {
    document.title = title
    window.onhashchange = onHashChange

    return () => {
      window.onhashchange = null
    }
  }, [])

  useEffect(() => {
    const fn = () => {
      setAppState(
        assign(appState, {
          offset: appState.offset + 50,
        })
      )
    }
    const handleScroll = () => {
      const lastItemLoaded = document.querySelector('.items > .item:last-child')
      if (lastItemLoaded) {
        const rect = lastItemLoaded.getBoundingClientRect()
        const lastItemLoadedOffset = rect.top + rect.width
        const pageOffset = window.pageYOffset + window.innerHeight
        if (pageOffset > lastItemLoadedOffset) {
          if (appState.offset < chart.length) {
            fn()
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [appState])

  const onHashChange = () => {
    const stateFromHash = getStateFromHash()

    setAppState(
      assign(stateFromHash, {
        offset: 50,
      })
    )

    if (Object.keys(stateFromHash).length !== 0) {
      window.scroll(0, 0)
    }
  }

  const paramValue = (param: string | (string | null)[] | null): string => {
    if (!param) {
      return ''
    }

    const value = Array.isArray(param) ? param[0] || '' : param

    return value.toLowerCase()
  }

  const getStateFromHash = () => {
    const params = qs.parse(location.hash)
    var newState: AppState = assign(initialState, {
      artistFilter: paramValue(params.artist),
      labelFilter: paramValue(params.label),
      genreFilter: paramValue(params.genre),
      chartByFilter: paramValue(params.chart_by),
    })

    return newState
  }

  const onChangeFilter = (
    t: 'artist' | 'title' | 'label' | 'genre' | 'chartBy'
  ): ((e: React.FormEvent<HTMLInputElement>) => void) => {
    return (e: React.FormEvent<HTMLInputElement>) => {
      const state = assign(initialState, {
        offset: 50,
      })

      state[`${t}Filter`] = e.currentTarget.value.toLowerCase()

      setAppState(state)
    }
  }

  const filter = (filterStr: string, target: string): boolean => {
    if (filterStr !== '') {
      return target.toLowerCase().indexOf(filterStr) !== -1
    } else {
      return true
    }
  }

  const items = chart
    .filter((item) => filter(appState.artistFilter, item.artist))
    .filter((item) => filter(appState.titleFilter, item.title))
    .filter((item) => filter(appState.genreFilter, item.genre))
    .filter((item) => filter(appState.labelFilter, item.label))
    .filter((item) =>
      filter(
        appState.chartByFilter,
        Object.keys(item.chart_by).join(' ').toLowerCase()
      )
    )

  const who = chartBy.find(
    (who) => who.toLowerCase() === appState.chartByFilter
  )
  if (who) {
    items.sort((a, b) => a.chart_by[who] - b.chart_by[who])
  }

  items.splice(appState.offset)

  return (
    <div>
      <h1>
        <a href="./">{title}</a>
      </h1>
      <div className="row">
        <div className="input-field col s12 m6 l2">
          <input
            className="validate"
            id="artist"
            type="text"
            onChange={onChangeFilter('artist')}
            value={appState.artistFilter}
          />
          <label
            htmlFor="artist"
            className={appState.artistFilter !== '' ? 'active' : ''}
          >
            Artist
          </label>
        </div>
        <div className="input-field col s12 m6 l2">
          <input
            id="title"
            type="text"
            onChange={onChangeFilter('title')}
            value={appState.titleFilter}
          />
          <label
            htmlFor="title"
            className={appState.titleFilter !== '' ? 'active' : ''}
          >
            Title
          </label>
        </div>
        <div className="input-field col s12 m6 l2">
          <input
            id="label"
            type="text"
            onChange={onChangeFilter('label')}
            value={appState.labelFilter}
          />
          <label
            htmlFor="label"
            className={appState.labelFilter !== '' ? 'active' : ''}
          >
            Label
          </label>
        </div>
        <div className="input-field col s12 m6 l2">
          <input
            id="genre"
            type="text"
            onChange={onChangeFilter('genre')}
            value={appState.genreFilter}
          />
          <label
            htmlFor="genre"
            className={appState.genreFilter !== '' ? 'active' : ''}
          >
            Genre
          </label>
        </div>
        <div className="input-field col s12 m12 l4">
          <input
            id="chart_by"
            type="text"
            onChange={onChangeFilter('chartBy')}
            value={appState.chartByFilter}
          />
          <label
            htmlFor="chart_by"
            className={appState.chartByFilter !== '' ? 'active' : ''}
          >
            Chart By
          </label>
        </div>
      </div>
      <div className="items">
        {items.map((item) => (
          <Item
            key={[item.artist, item.title].join('_')}
            data={item}
            chartBy={appState.chartByFilter}
          ></Item>
        ))}
      </div>
    </div>
  )
}

export default App
