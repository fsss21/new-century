import { useState, useRef, useCallback } from 'react'
import { useLocation } from 'react-router'
import styles from './PhotoGallery.module.css'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

const PhotoGallery = ({ photos = [], title = '' }) => {
    const [index, setIndex] = useState(0)
    const wrapRef = useRef(null)
    const total = photos.length
    const location = useLocation()

    const prev = useCallback(() => {
        setIndex((i) => (i > 0 ? i - 1 : i))
    }, [])

    const next = useCallback(() => {
        setIndex((i) => (i < total - 1 ? i + 1 : i))
    }, [total])

    const handleFullscreen = useCallback(() => {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen()
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
        } else {
            const el = wrapRef.current
            if (!el) return
            if (el.requestFullscreen) el.requestFullscreen()
            else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
        }
    }, [])

    if (!total) return null

    const isBiographyItemPage = location.pathname.startsWith('/biography/') && location.pathname !== '/biography'

    const isCatalogItemPage = location.pathname.startsWith('/catalog/') && location.pathname !== '/catalog'

    return (
        <div className={`${styles.wrap} ${isBiographyItemPage ? styles.wrapBiographyItemPage : ''}  ${isCatalogItemPage ? styles.wrapCatalogItemPage : ''}`} ref={wrapRef}>
            <img
                className={styles.image}
                src={photos[index]}
                alt={`${title} — ${index + 1}`}
            />
            <div className={`${styles.nav} ${isBiographyItemPage ? styles.navBiographyItemPage : ''} ${isCatalogItemPage ? styles.navCatalogItemPage : ''} `}>
                <button
                    className={styles.arrow}
                    onClick={prev}
                    disabled={index === 0}
                >
                    <ArrowBackIosNewIcon fontSize="large" />
                </button>
                <span className={styles.counter}>
                    {index + 1} / {total}
                </span>
                <button
                    className={styles.arrow}
                    onClick={next}
                    disabled={index === total - 1}
                >
                    <ArrowForwardIosIcon fontSize="large" />
                </button>
                <button className={styles.fullscreen} onClick={handleFullscreen}>
                    <FullscreenIcon fontSize="large" />
                </button>
            </div>
        </div>
    )
}

export default PhotoGallery
