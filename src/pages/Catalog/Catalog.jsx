import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import styles from './Catalog.module.css'
import catalogImg from '../../assets/catalog_img.png'
import catalogImg4k from '../../assets/catalog_img-4k.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const PARAM_SCULPTORS = 'sculptors'
const PARAM_ERAS = 'eras'
const PARAM_MATERIALS = 'materials'
const PARAM_TOMBSTONE = 'tombstoneTypes'
const PARAM_Q = 'q'

function parseArrayParam(str) {
    if (!str || typeof str !== 'string') return []
    return str.split(',').map((s) => decodeURIComponent(s.trim())).filter(Boolean)
}

function matchesSearch(item, q) {
    if (!q || !q.trim()) return true
    const lower = q.trim().toLowerCase()
    const title = (item.title ?? '').toLowerCase()
    const sculptor = (item.sculptor ?? '').toLowerCase()
    return title.includes(lower) || sculptor.includes(lower)
}

const Catalog = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [backgroundSrc, setBackgroundSrc] = useState(catalogImg)
    const [items, setItems] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const selectedSculptors = useMemo(() => parseArrayParam(searchParams.get(PARAM_SCULPTORS)), [searchParams])
    const selectedEras = useMemo(() => parseArrayParam(searchParams.get(PARAM_ERAS)), [searchParams])
    const selectedMaterials = useMemo(() => parseArrayParam(searchParams.get(PARAM_MATERIALS)), [searchParams])
    const selectedTombstoneTypes = useMemo(() => parseArrayParam(searchParams.get(PARAM_TOMBSTONE)), [searchParams])
    const searchQuery = searchParams.get(PARAM_Q) ?? ''

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            if (selectedSculptors.length > 0 && !selectedSculptors.includes(item.sculptor)) return false
            const itemEra = item.era ?? item.date
            if (selectedEras.length > 0 && !selectedEras.includes(itemEra)) return false
            if (selectedMaterials.length > 0 && !selectedMaterials.includes(item.material)) return false
            if (selectedTombstoneTypes.length > 0 && !selectedTombstoneTypes.includes(item.tombstoneType)) return false
            if (!matchesSearch(item, searchQuery)) return false
            return true
        })
    }, [items, selectedSculptors, selectedEras, selectedMaterials, selectedTombstoneTypes, searchQuery])

    useEffect(() => {
        const updateBg = () => {
            const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
            setBackgroundSrc(is4K ? catalogImg4k : catalogImg)
        }
        updateBg()
        window.addEventListener('resize', updateBg)
        return () => window.removeEventListener('resize', updateBg)
    }, [])

    useEffect(() => {
        fetch('/data/Catalog.json')
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setItems(Array.isArray(data) ? data : []))
            .catch(() => setItems([]))
    }, [])

    useEffect(() => {
        setCurrentIndex((i) => Math.min(i, Math.max(0, filteredItems.length - 1)))
    }, [filteredItems.length])

    const len = filteredItems.length

    const handlePrev = () => {
        if (len === 0) return
        setCurrentIndex((i) => (i - 1 + len) % len)
    }

    const handleNext = () => {
        if (len === 0) return
        setCurrentIndex((i) => (i + 1) % len)
    }

    const handleClick = (item) => {
        navigate(`/catalog/${item.id}`)
    }

    const handleBack = () => {
        navigate('/')
    }

    const getItem = (offset) => {
        if (len === 0) return null
        return filteredItems[(currentIndex + offset + len) % len]
    }

    const prevItem = getItem(-1)
    const centerItem = getItem(0)
    const nextItem = getItem(1)

    const getThumb = (item) => {
        if (item?.photos?.length > 0 && item.photos[0]) return item.photos[0]
        return null
    }

    if (items.length === 0) {
        return (
            <div className={styles.catalog}>
                <div className={styles.background} style={{ backgroundImage: `url(${backgroundSrc})` }} />
            </div>
        )
    }

    if (len === 0) {
        return (
            <div className={styles.catalog}>
                <div className={styles.background} style={{ backgroundImage: `url(${backgroundSrc})` }} />
                <p className={styles.catalogEmpty}>По вашему запросу ничего не найдено. Измените фильтры или поиск.</p>
                <div className={styles.containerBackBtn}>
                    <button className={styles.backBtn} onClick={handleBack}>назад</button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.catalog}>
            <div className={styles.background} style={{ backgroundImage: `url(${backgroundSrc})` }} />

            <div className={styles.carousel}>
                <button className={styles.arrow} onClick={handlePrev} disabled={len < 2}>
                    <ArrowBackIosNewIcon />
                </button>

                <div className={styles.slots}>
                    {prevItem && len > 1 && (
                        <div className={`${styles.slot} ${styles.slotSide}`}>
                            <div className={styles.slotInnerSide}>
                                {getThumb(prevItem) ? (
                                    <img className={styles.slotImg} src={getThumb(prevItem)} alt={prevItem.title} />
                                ) : (
                                    <div className={styles.slotNoImg} />
                                )}
                            </div>
                            <div className={styles.containerSlotAsideTitle}>
                                <span className={styles.slotTitle}>{prevItem.title}</span>
                                <span className={styles.slotSubTitle}>{prevItem.date}</span>
                            </div>
                        </div>
                    )}

                    {centerItem && (
                        <div className={`${styles.slot} ${styles.slotCenter}`} onClick={() => handleClick(centerItem)}>
                            <div className={styles.slotInner}>
                                {getThumb(centerItem) ? (
                                    <img className={styles.slotImg} src={getThumb(centerItem)} alt={centerItem.title} />
                                ) : (
                                    <div className={styles.slotNoImg} />
                                )}

                            </div>
                            <div className={styles.containerSlotTitle}>
                                <span className={styles.slotTitle}>{centerItem.title}</span>
                                <span className={styles.slotSubTitle}>{centerItem.date}</span>
                            </div>
                        </div>
                    )}

                    {nextItem && len > 1 && (
                        <div className={`${styles.slot} ${styles.slotSide}`} >
                            <div className={styles.slotInnerSide}>
                                {getThumb(nextItem) ? (
                                    <img className={styles.slotImg} src={getThumb(nextItem)} alt={nextItem.title} />
                                ) : (
                                    <div className={styles.slotNoImg} />
                                )}

                            </div>
                            <div className={styles.containerSlotAsideTitle}>
                                <span className={styles.slotTitle}>{nextItem.title}</span>
                                <span className={styles.slotSubTitle}>{nextItem.date}</span>
                            </div>
                        </div>
                    )}
                </div>

                <button className={styles.arrow} onClick={handleNext} disabled={len < 2}>
                    <ArrowForwardIosIcon />
                </button>
            </div>

            <div className={styles.containerBackBtn}>
                <button className={styles.backBtn} onClick={handleBack}>назад</button>
            </div>
        </div>
    )
}

export default Catalog
