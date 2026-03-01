import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import styles from './BiographyItem.module.css'

import biographyItemImg from '../../../assets/biography_item_img.png'
import biographyItemImg4k from '../../../assets/biography_item_img-4k.png'
import noPhotoImg from '../../../assets/biography_item_noPhoto_img.png'
import noPhotoImg4k from '../../../assets/biography_item_noPhoto_img-4k.png'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PhotoGallery from '../../../components/PhotoGallery/PhotoGallery'

const BiographyItem = () => {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [textPage, setTextPage] = useState(0)

    useEffect(() => {
        fetch('/data/Biography.json')
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                const found = (Array.isArray(data) ? data : [])
                    .find((entry) => String(entry.id) === String(id))
                setItem(found ?? null)
            })
            .catch(() => setItem(null))
    }, [id])

    const fullName = item
        ? [item.lastName, item.firstName, item.surname].filter(Boolean).join(' ')
        : ''

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

    const [bgSrc, setBgSrc] = useState(biographyItemImg)

    useEffect(() => {
        const update = () => {
            const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
            if (hasPhotos) {
                setBgSrc(is4K ? biographyItemImg4k : biographyItemImg)
            } else {
                setBgSrc(is4K ? noPhotoImg4k : noPhotoImg)
            }
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [hasPhotos])

    if (!item) return null

    return (
        <div className={styles.biographyItem}>
            <div className={styles.background} style={{ backgroundImage: `url(${bgSrc})` }} />

            {hasPhotos ? (
                <div className={styles.contentRow}>
                    <aside className={styles.textBlock}>
                        <h2 className={styles.title}>{fullName}</h2>
                        <p className={styles.text}>{textPages[textPage]}</p>
                        {hasMultiplePages && (
                            <div className={styles.textNav}>
                                <button
                                    className={styles.textNavArrow}
                                    onClick={prevTextPage}
                                    disabled={textPage === 0}
                                >
                                    <ArrowBackIosNewIcon fontSize="small" />
                                </button>
                                <span className={styles.textNavCounter}>
                                    {textPage + 1} / {totalTextPages}
                                </span>
                                <button
                                    className={styles.textNavArrow}
                                    onClick={nextTextPage}
                                    disabled={textPage === totalTextPages - 1}
                                >
                                    <ArrowForwardIosIcon fontSize="small" />
                                </button>
                            </div>
                        )}
                    </aside>
                    <div className={styles.photoBlock}>
                        <PhotoGallery photos={photos} title={fullName} />
                    </div>
                </div>
            ) : (
                <div className={styles.centeredContent}>
                    <h2 className={styles.titleCentered}>{fullName}</h2>
                    <p className={styles.textCentered}>{textPages[textPage]}</p>
                    {hasMultiplePages && (
                        <div className={styles.textNav}>
                            <button
                                className={styles.textNavArrow}
                                onClick={prevTextPage}
                                disabled={textPage === 0}
                            >
                                <ArrowBackIosNewIcon fontSize="small" />
                            </button>
                            <span className={styles.textNavCounter}>
                                {textPage + 1} / {totalTextPages}
                            </span>
                            <button
                                className={styles.textNavArrow}
                                onClick={nextTextPage}
                                disabled={textPage === totalTextPages - 1}
                            >
                                <ArrowForwardIosIcon fontSize="small" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default BiographyItem
