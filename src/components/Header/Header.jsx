import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Header.module.css'

import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

const TITLE = 'современная скульптура'

const PARAM_SCULPTORS = 'sculptors'
const PARAM_ERAS = 'eras'
const PARAM_MATERIALS = 'materials'
const PARAM_TOMBSTONE = 'tombstoneTypes'
const PARAM_Q = 'q'

function parseArrayParam(str) {
    if (!str || typeof str !== 'string') return []
    return str.split(',').map((s) => decodeURIComponent(s.trim())).filter(Boolean)
}

function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [items, setItems] = useState([])
    const [catalogItems, setCatalogItems] = useState([])

    const isMainMenuPage = location.pathname === '/'

    const section = useMemo(() => {
        if (location.pathname.startsWith('/biography/') && location.pathname !== '/biography') return 'biography'
        if (location.pathname.startsWith('/catalog/') && location.pathname !== '/catalog') return 'catalog'
        return null
    }, [location.pathname])

    const isCatalogPage = location.pathname === '/catalog'

    const currentId = useMemo(() => {
        if (!section) return null
        const parts = location.pathname.split('/')
        return parts[parts.length - 1]
    }, [section, location.pathname])

    // ── Catalog filter state (from URL) ──
    const selectedSculptors = useMemo(
        () => parseArrayParam(searchParams.get(PARAM_SCULPTORS)),
        [searchParams]
    )
    const selectedEras = useMemo(
        () => parseArrayParam(searchParams.get(PARAM_ERAS)),
        [searchParams]
    )
    const selectedMaterials = useMemo(
        () => parseArrayParam(searchParams.get(PARAM_MATERIALS)),
        [searchParams]
    )
    const selectedTombstoneTypes = useMemo(
        () => parseArrayParam(searchParams.get(PARAM_TOMBSTONE)),
        [searchParams]
    )
    const searchQuery = searchParams.get(PARAM_Q) ?? ''

    const [filtersOpen, setFiltersOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [localSearch, setLocalSearch] = useState(searchQuery)
    const [hiddenSections, setHiddenSections] = useState({ sculptors: false, eras: false, materials: false, tombstoneTypes: false })

    // Fetch catalog for nav (biography/catalog item)
    useEffect(() => {
        if (!section) {
            setItems([])
            return
        }
        const file = section === 'biography' ? '/data/Biography.json' : '/data/Catalog.json'
        fetch(file)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setItems(Array.isArray(data) ? data : []))
            .catch(() => setItems([]))
    }, [section])

    // Fetch catalog for filter options when on catalog page
    useEffect(() => {
        if (!isCatalogPage) {
            setCatalogItems([])
            return
        }
        fetch('/data/Catalog.json')
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setCatalogItems(Array.isArray(data) ? data : []))
            .catch(() => setCatalogItems([]))
    }, [isCatalogPage])

    // Derive filter options from data (universal: any future fields can be added)
    const filterOptions = useMemo(() => {
        const list = catalogItems
        const sculptors = [...new Set(list.map((i) => i.sculptor).filter(Boolean))].sort()
        const eras = [...new Set(list.map((i) => i.era ?? i.date).filter(Boolean))].sort()
        const materials = [...new Set(list.map((i) => i.material).filter(Boolean))].sort()
        const tombstoneTypes = [...new Set(list.map((i) => i.tombstoneType).filter(Boolean))].sort()
        return { sculptors, eras, materials, tombstoneTypes }
    }, [catalogItems])

    const currentIndex = useMemo(() => {
        if (!currentId || items.length === 0) return -1
        return items.findIndex((item) => String(item.id) === String(currentId))
    }, [currentId, items])

    const hasPrev = currentIndex > 0
    const hasNext = currentIndex >= 0 && currentIndex < items.length - 1

    const onPrev = () => {
        if (!hasPrev) return
        navigate(`/${section}/${items[currentIndex - 1].id}`)
    }
    const onNext = () => {
        if (!hasNext) return
        navigate(`/${section}/${items[currentIndex + 1].id}`)
    }
    const onClose = () => navigate(`/${section}`)

    // ── Filter handlers (update URL) ──
    const updateParams = (updates) => {
        const next = new URLSearchParams(searchParams)
        Object.entries(updates).forEach(([key, value]) => {
            if (value == null || (Array.isArray(value) && value.length === 0)) next.delete(key)
            else if (Array.isArray(value)) next.set(key, value.map((v) => encodeURIComponent(v)).join(','))
            else next.set(key, String(value))
        })
        setSearchParams(next)
    }

    const toggleSculptor = (name) => {
        const next = selectedSculptors.includes(name)
            ? selectedSculptors.filter((s) => s !== name)
            : [...selectedSculptors, name]
        updateParams({ [PARAM_SCULPTORS]: next })
    }
    const toggleEra = (name) => {
        const next = selectedEras.includes(name)
            ? selectedEras.filter((e) => e !== name)
            : [...selectedEras, name]
        updateParams({ [PARAM_ERAS]: next })
    }
    const toggleMaterial = (name) => {
        const next = selectedMaterials.includes(name)
            ? selectedMaterials.filter((m) => m !== name)
            : [...selectedMaterials, name]
        updateParams({ [PARAM_MATERIALS]: next })
    }
    const toggleTombstoneType = (name) => {
        const next = selectedTombstoneTypes.includes(name)
            ? selectedTombstoneTypes.filter((t) => t !== name)
            : [...selectedTombstoneTypes, name]
        updateParams({ [PARAM_TOMBSTONE]: next })
    }

    const toggleSectionVisible = (key) => {
        setHiddenSections((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const handleFiltersToggle = () => setFiltersOpen((o) => !o)
    const handleShowFilters = () => setFiltersOpen(false)

    const handleSearchToggle = () => {
        setSearchOpen((o) => !o)
        if (!searchOpen) setLocalSearch(searchQuery)
    }
    const handleSearchSubmit = (e) => {
        e?.preventDefault?.()
        updateParams({ [PARAM_Q]: localSearch.trim() })
        setSearchOpen(false)
    }

    useEffect(() => {
        setLocalSearch(searchQuery)
    }, [searchQuery])

    return (
        <header
            className={`${styles.header} ${section ? styles.headerWithSection : ''} ${isCatalogPage ? styles.headerCatalogPage : ''}`}
        >
            <div className={styles.headerTitleBlock}>
                <h2 className={`${styles.headerTitle} ${isMainMenuPage ? styles.headerTitleMainMenu : ''}`}>
                    {TITLE}
                </h2>
            </div>

            {section && (
                <div className={styles.navButtons}>
                    <div className={styles.arrows}>
                        <button
                            className={styles.navButton}
                            onClick={onPrev}
                            disabled={!hasPrev}
                            aria-label="Предыдущий"
                        />
                        <button
                            className={styles.navButton}
                            onClick={onNext}
                            disabled={!hasNext}
                            aria-label="Следующий"
                        />
                    </div>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть" />
                </div>
            )}

            {isCatalogPage && (
                <div className={styles.headerButtons}>
                    <div className={styles.headerDropdownWrap}>
                        <button
                            type="button"
                            className={styles.headerBtnFilters}
                            onClick={handleFiltersToggle}
                            aria-expanded={filtersOpen}
                            aria-haspopup="true"
                            aria-label="Открыть фильтры"
                        >
                            <MenuIcon />
                        </button>
                        {filtersOpen && (
                            <div className={styles.headerDropdown} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.headerDropdownHeader}>
                                    <h3 className={styles.headerDropdownTitle}>Фильтры</h3>
                                    <button
                                        type="button"
                                        className={styles.headerDropdownClose}
                                        onClick={() => setFiltersOpen(false)}
                                        aria-label="Закрыть фильтры"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                {filterOptions.sculptors.length > 0 && (
                                    <div className={styles.headerFilterBlock}>
                                        {hiddenSections.sculptors ? (
                                            <div className={styles.headerFilterLabelWrap}>
                                                <span className={styles.headerFilterLabel}>Скульпторы</span>
                                                <button type="button" className={styles.headerHideBtn} onClick={() => toggleSectionVisible('sculptors')}>
                                                    Показать
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.headerFilterLabelWrap}>
                                                    <span className={styles.headerFilterLabel}>Скульпторы</span>
                                                    <button type="button" className={styles.headerHideBtn} onClick={() => toggleSectionVisible('sculptors')}>
                                                        Скрыть
                                                    </button>
                                                </div>
                                                <div className={styles.headerFilterOptions}>
                                                    {filterOptions.sculptors.map((name) => (
                                                        <label key={name} className={styles.headerFilterCheck}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSculptors.includes(name)}
                                                                onChange={() => toggleSculptor(name)}
                                                            />
                                                            {name}
                                                        </label>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {filterOptions.eras.length > 0 && (
                                    <div className={styles.headerFilterBlock}>
                                        {hiddenSections.eras ? (
                                            <div className={styles.headerFilterLabelWrap}>
                                                <span className={styles.headerFilterLabel}>Года</span>
                                                <button type="button" className={styles.headerHideBtn} onClick={() => toggleSectionVisible('eras')}>
                                                    Показать
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.headerFilterLabelWrap}>
                                                    <span className={styles.headerFilterLabel}>Года</span>
                                                    <button type="button" className={styles.headerHideBtn} onClick={() => toggleSectionVisible('eras')}>
                                                        Скрыть
                                                    </button>
                                                </div>
                                                <div className={styles.headerFilterOptions}>
                                                    {filterOptions.eras.map((name) => (
                                                        <label key={name} className={styles.headerFilterCheck}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedEras.includes(name)}
                                                                onChange={() => toggleEra(name)}
                                                            />
                                                            {name}
                                                        </label>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {filterOptions.materials.length > 0 && (
                                    <div className={styles.headerFilterBlock}>
                                        {hiddenSections.materials ? (
                                            <div className={styles.headerFilterLabelWrap}>
                                                <span className={styles.headerFilterLabel}>Материал</span>
                                                <button type="button" className={styles.headerHideBtn} onClick={() => toggleSectionVisible('materials')}>
                                                    Показать
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.headerFilterLabelWrap}>
                                                    <span className={styles.headerFilterLabel}>Материал</span>
                                                    <button type="button" className={styles.headerHideBtn} onClick={() => toggleSectionVisible('materials')}>
                                                        Скрыть
                                                    </button>
                                                </div>
                                                <div className={styles.headerFilterOptions}>
                                                    {filterOptions.materials.map((name) => (
                                                        <label key={name} className={styles.headerFilterCheck}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedMaterials.includes(name)}
                                                                onChange={() => toggleMaterial(name)}
                                                            />
                                                            {name}
                                                        </label>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {filterOptions.tombstoneTypes.length > 0 && (
                                    <div className={styles.headerFilterBlock}>
                                        {hiddenSections.tombstoneTypes ? (
                                            <div className={styles.headerFilterLabelWrap}>
                                                <span className={styles.headerFilterLabel}>Типы надгробий</span>
                                                <button type="button" className={styles.headerHideBtn} onClick={() => toggleSectionVisible('tombstoneTypes')}>
                                                    Показать
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.headerFilterLabelWrap}>
                                                    <span className={styles.headerFilterLabel}>Типы надгробий</span>
                                                    <button type="button" className={styles.headerHideBtn} onClick={() => toggleSectionVisible('tombstoneTypes')}>
                                                        Скрыть
                                                    </button>
                                                </div>
                                                <div className={styles.headerFilterOptions}>
                                                    {filterOptions.tombstoneTypes.map((name) => (
                                                        <label key={name} className={styles.headerFilterCheck}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedTombstoneTypes.includes(name)}
                                                                onChange={() => toggleTombstoneType(name)}
                                                            />
                                                            {name}
                                                        </label>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                <button type="button" className={styles.headerShowBtn} onClick={handleShowFilters}>
                                    Показать
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.headerSearchWrap}>
                        <button
                            type="button"
                            className={styles.headerBtnSearch}
                            onClick={handleSearchToggle}
                            aria-expanded={searchOpen}
                            aria-label="Открыть поиск"
                        >
                            <SearchIcon />
                        </button>
                        {searchOpen && (
                            <div className={styles.headerSearchPanel} onClick={(e) => e.stopPropagation()}>
                                <form className={styles.headerSearchForm} onSubmit={handleSearchSubmit}>
                                    <button type="submit" className={styles.headerSearchIconBtn} aria-label="Выполнить поиск">
                                        <SearchIcon fontSize="large" />
                                    </button>
                                    <input
                                        type="text"
                                        className={styles.headerSearchInput}
                                        placeholder="Название, автор, материал, место"
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        autoFocus
                                        aria-label="Поиск"
                                    />
                                </form>
                                <button
                                    type="button"
                                    className={styles.headerSearchClose}
                                    onClick={() => setSearchOpen(false)}
                                    aria-label="Закрыть поиск"
                                >
                                    <CloseIcon fontSize="large" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
