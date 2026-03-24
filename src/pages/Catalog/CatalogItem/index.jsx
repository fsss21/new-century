import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import styles from './CatalogItem.module.css'

import catalogItemImg from '../../../assets/catalog_item_img.png'
import catalogItemImg4k from '../../../assets/catalog_item_img-4k.png'


import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PhotoGallery from '../../../components/PhotoGallery/PhotoGallery'

const CatalogItem = () => {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [textPage, setTextPage] = useState(0)

    useEffect(() => {
        fetch('/data/Catalog.json')
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                const found = (Array.isArray(data) ? data : [])
                    .find((entry) => String(entry.id) === String(id))
                setItem(found ?? null)
            })
            .catch(() => setItem(null))
    }, [id])

    const hasPhotos = item?.photos?.some((p) => p && p.length > 0)
    const photos = hasPhotos ? item.photos.filter((p) => p && p.length > 0) : []

    const textPages = Array.isArray(item?.text) ? item.text : [item?.text ?? '']
    const totalTextPages = textPages.length
    const hasMultiplePages = totalTextPages > 1

    const prevTextPage = useCallback(() => {
        setTextPage((i) => (i > 0 ? i - 1 : i))
    }, [])

    const nextTextPage = useCallback(() => {
        setTextPage((i) => (i < totalTextPages - 1 ? i + 1 : i))
    }, [totalTextPages])

    const [BackgroundSrc, setBackgroundSrc] = useState(catalogItemImg)

    useEffect(() => {
        const updateBackground = () => {
            const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
            setBackgroundSrc(is4K ? catalogItemImg4k : catalogItemImg)
        }
        updateBackground()
        window.addEventListener('resize', updateBackground)
        return () => window.removeEventListener('resize', updateBackground)
    }, [])

    if (!item) return null

    const title = item.title ?? ''
    const sculptor = item.sculptor ?? ''
    const date = item.date ?? ''
    const location = item.location ?? ''

    return (
        <div className={styles.catalogItem}>
            <div className={styles.background} style={{ backgroundImage: `url(${BackgroundSrc})` }} />
            <div className={styles.contentRow}>
                <aside className={styles.textBlock}>
                    <div className={styles.textBlockContent}>
                        <h2 className={styles.title}>{title}</h2>
                        <div className={styles.textDesc}>
                            <span><strong className={styles.strongColor}>Скульптор:</strong> {sculptor}</span>
                            <span><strong className={styles.strongColor}>Время создания:</strong>{date}</span>
                            <span><strong className={styles.strongColor}>Где находится:</strong>{location}</span>
                            <p className={styles.text}>{textPages[textPage]}</p>
                        </div>
                    </div>
                    {hasMultiplePages && (
                        <div className={styles.textNav}>
                            <span className={styles.textNavCounter}>
                                {textPage + 1} / {totalTextPages}
                            </span>
                            <div className={styles.arrows}>
                                <button
                                    className={styles.textNavArrow}
                                    onClick={prevTextPage}
                                    disabled={textPage === 0}
                                >
                                    <ArrowBackIosNewIcon fontSize="small" />
                                </button>
                                <button
                                    className={styles.textNavArrow}
                                    onClick={nextTextPage}
                                    disabled={textPage === totalTextPages - 1}
                                >
                                    <ArrowForwardIosIcon fontSize="small" />
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
                <div className={styles.photoBlock}>
                    <PhotoGallery photos={photos} />
                </div>
            </div>
        </div>
    )
}

export default CatalogItem
