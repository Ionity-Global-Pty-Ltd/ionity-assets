const grid = document.querySelector('#asset-grid')
const search = document.querySelector('#search')
const filters = document.querySelector('#filters')
const resultCount = document.querySelector('#result-count')
const emptyState = document.querySelector('#empty-state')
const loadMore = document.querySelector('#load-more')
const template = document.querySelector('#asset-template')

const pageSize = 48
let catalog = []
let activeCategory = 'all'
let visibleCount = pageSize

const labels = {
  all: 'All assets', image: 'Images', video: 'Video', audio: 'Audio',
  document: 'Documents', metadata: 'Metadata', code: 'Code', archive: 'Archives', other: 'Other',
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)) - 1, units.length - 1)
  return `${(bytes / 1024 ** (unitIndex + 1)).toFixed(unitIndex ? 1 : 0)} ${units[unitIndex]}`
}

function filteredAssets() {
  const query = search.value.trim().toLowerCase()
  return catalog.filter((asset) => {
    const categoryMatches = activeCategory === 'all' || asset.category === activeCategory
    const queryMatches = !query || `${asset.name} ${asset.path} ${asset.format} ${asset.category}`.toLowerCase().includes(query)
    return categoryMatches && queryMatches
  })
}

function createCard(asset) {
  const card = template.content.firstElementChild.cloneNode(true)
  const preview = card.querySelector('.preview')
  const image = card.querySelector('img')
  const symbol = card.querySelector('.file-symbol')

  preview.href = asset.raw_url
  card.querySelector('h3').textContent = asset.name
  card.querySelector('.path').textContent = asset.path
  card.querySelector('.size').textContent = formatBytes(asset.bytes)
  card.querySelector('.format-badge').textContent = asset.format
  symbol.textContent = asset.category.slice(0, 3).toUpperCase()

  if (asset.category === 'image' && asset.format !== 'ico') {
    image.src = asset.raw_url
    image.alt = `Preview of ${asset.name}`
    image.hidden = false
    symbol.hidden = true
  } else {
    image.hidden = true
    symbol.hidden = false
  }

  const copyButton = card.querySelector('.copy-button')
  copyButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText(asset.raw_url)
    copyButton.textContent = 'Copied'
    setTimeout(() => { copyButton.textContent = 'Copy raw URL' }, 1600)
  })

  const download = card.querySelector('.download-link')
  download.href = asset.raw_url
  download.setAttribute('download', asset.name)
  card.querySelector('.source-link').href = asset.github_url
  return card
}

function render() {
  const matches = filteredAssets()
  const visible = matches.slice(0, visibleCount)
  grid.replaceChildren(...visible.map(createCard))
  grid.setAttribute('aria-busy', 'false')
  resultCount.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`
  emptyState.hidden = matches.length > 0
  loadMore.hidden = visible.length >= matches.length
}

function renderFilters(counts) {
  const categoryCounts = { all: catalog.length, ...counts }
  filters.replaceChildren(...Object.entries(categoryCounts).map(([category, count]) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset.category = category
    button.className = category === activeCategory ? 'active' : ''
    button.textContent = `${labels[category] ?? category} ${count}`
    button.addEventListener('click', () => {
      activeCategory = category
      visibleCount = pageSize
      filters.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button))
      render()
    })
    return button
  }))
}

search.addEventListener('input', () => { visibleCount = pageSize; render() })
loadMore.addEventListener('click', () => { visibleCount += pageSize; render() })
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== search) {
    event.preventDefault()
    search.focus()
  }
})

try {
  const response = await fetch('assets.json')
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`)
  const data = await response.json()
  catalog = data.assets
  document.querySelector('#asset-count').textContent = data.asset_count.toLocaleString()
  document.querySelector('#format-count').textContent = new Set(catalog.map(({ format }) => format)).size
  renderFilters(data.counts)
  render()
} catch (error) {
  grid.setAttribute('aria-busy', 'false')
  resultCount.textContent = 'Catalog unavailable'
  emptyState.hidden = false
  emptyState.querySelector('strong').textContent = 'Unable to load the asset catalog'
  emptyState.querySelector('span').textContent = 'Open the GitHub repository to browse the source files.'
  console.error(error)
}