import LazyLoad from 'react-lazyload'

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

type Props = {
  data: ChartItem
  chartBy: string
}

export function Item({ data, chartBy }: Props) {
  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.visibility = 'hidden'
  }

  return (
    <div className="item" key={data.title + data.artist}>
      <LazyLoad height={150}>
        <img src={data.img_url} height="150" onError={onImageError} />
      </LazyLoad>
      <div className="info">
        {data.url && (
          <h2 className="flow-text">
            <a href={`${data.url}`}>
              {data.artist} / {data.title}
            </a>
          </h2>
        )}
        {!data.url && (
          <h2 className="flow-text">
            {data.artist} / {data.title}
          </h2>
        )}
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
