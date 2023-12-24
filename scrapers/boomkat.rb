require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'http-cookie'
  gem 'nokogiri'
  gem 'selenium-webdriver'
end

require 'json'
require 'logger'

YEAR = (ARGV.shift || "2021")

class Scraper
  def initialize
    options = Selenium::WebDriver::Chrome::Options.new
    options.add_argument('start-maximized')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('--user-data-dir=/tmp/profile')
    @driver = Selenium::WebDriver.for :chrome, options: options
  end

  def scrape
    logger = Logger.new($stderr)

    doc('https://boomkat.com/charts/boomkat-end-of-year-charts-%s' % YEAR, '.charts-index-chart').
      css('.charts-index-chart').
      find_all do |a|
      a['href'] && a['href'] !~ /\/charts\/boomkat-end-of-year-charts-#{YEAR}\/94[012]/
    end.map do |a|
      data = chart(a['href'])
      logger.info("scraped a chart by %s" % data[:chart_by])
      data
    end
  end

  def chart(url)
    doc = doc('https://boomkat.com' + url, '.chart-topbanner-title')
    chart_author = doc.css('.chart-topbanner-title').text.strip.sub(/ #{YEAR}$/, '')
    doc.css('.chart-item').inject({ chart_by: chart_author }) do |memo, div|
      url = nil
      img_url = nil

      if div.css('a').size > 0
        url = 'https://boomkat.com' + div.css('a')[0]['href']
      end

      if div.css('img').size > 0
        img_url = div.css('img')[0]['src']
      end

      artist = div.css('.release__artist').text.strip
      title = div.css('.release__title').text.strip
      label = div.css('.release__label').text.strip
      genre = div.css('.release__genre').text.strip

      memo[:items] ||= []
      memo[:items] << {
        url: url,
        img_url: img_url,
        artist: artist,
        title: title,
        label: label,
        genre: genre
      }

      memo
    end
  end

  private

  def doc(url, selector = nil)
    # remove props from chromedriver
    #
    # see https://github.com/ultrafunkamsterdam/undetected-chromedriver/blob/33d2a728488d12936d0bcc1e97f8e7a040a3b31f/undetected_chromedriver/__init__.py#L637
    @driver.execute_cdp("Page.addScriptToEvaluateOnNewDocument", {
      source: <<-EOM
      let objectToInspect = window,
      result = [];
      while(objectToInspect !== null)
      { result = result.concat(Object.getOwnPropertyNames(objectToInspect));
      objectToInspect = Object.getPrototypeOf(objectToInspect); }
      result.forEach(p => p.match(/.+_.+_(Array|Promise|Symbol)/ig)
                      &&delete window[p]&&console.log('removed',p))
      EOM
    })
    @driver.navigate.to(url)
    body = nil

    Timeout.timeout(30) do
      loop do
        body = @driver.page_source
        break if selector.nil? || !Nokogiri::HTML(body).css(selector).empty?
        sleep 1
      end
    end

    sleep 5

    Nokogiri::HTML(body)
  end
end

def main
  puts JSON.pretty_generate(
         title: 'Boomkat Charts %s: Merged' % YEAR,
         data: Scraper.new.scrape
       )
end

main
