import LazyLoad from 'react-lazyload'
import { ChartItem } from './types'

type Props = {
  data: ChartItem
  chartBy: string
}

export function Item({ data, chartBy }: Props) {
  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = 'hidden'
  }

  const url = data.url || googleSearchUrl(`${data.artist} / ${data.title}`)

  return (
    <div className="item" key={data.title + data.artist}>
      <LazyLoad height={150}>
        <img src={data.img_url} height="150" onError={onImageError} />
      </LazyLoad>
      <div className="info">
        <h2 className="flow-text">
          <a href={`${url}`}>
            {data.artist} / {data.title}
          </a>
        </h2>
        <div className="label">
          <a href={`#label=${encodeURIComponent(data.label)}`}>{data.label}</a>
        </div>
        <div className="genre">
          <a href={`#genre=${encodeURIComponent(data.genre)}`}>{data.genre}</a>
        </div>
        <ul className="by">
          {Object.keys(data.chart_by).map((who) => (
            <li
              key={who}
              className="chip"
              style={{
                border: data.chart_by[who] === 1 ? '#ccc 2px solid' : undefined,
                background: who.toLowerCase() === chartBy ? '#fcc' : undefined,
              }}
            >
              <a href={`#chart_by=${encodeURIComponent(who)}`}>{who}</a>:{' '}
              {data.chart_by[who]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function googleSearchUrl(q: string): string {
  const url = new URL('https://www.google.com/search')

  url.searchParams.set('q', q)

  return url.toString()
}
