import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Biography.module.css'

import biographyImg from '../../assets/biography_img.png'
import biographyImg4k from '../../assets/biography_img-4k.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const Biography = () => {
    const navigate = useNavigate()
    const [backgroundSrc, setBackgroundSrc] = useState(biographyImg)
    const [items, setItems] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const updateBg = () => {
            const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
            setBackgroundSrc(is4K ? biographyImg4k : biographyImg)
        }
        updateBg()
        window.addEventListener('resize', updateBg)
        return () => window.removeEventListener('resize', updateBg)
    }, [])

    useEffect(() => {
        fetch('/data/Biography.json')
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setItems(Array.isArray(data) ? data : []))
            .catch(() => setItems([]))
    }, [])

    const len = items.length

    const handlePrev = () => {
        if (len === 0) return
        setCurrentIndex((i) => (i - 1 + len) % len)
    }

    const handleNext = () => {
        if (len === 0) return
        setCurrentIndex((i) => (i + 1) % len)
    }

    const handleClick = (item) => {
        navigate(`/biography/${item.id}`)
    }

    const handleClickCatalog = () => {
        navigate('/catalog')
    }

    const handleClickBack = () => {
        navigate('/')
    }

    const getItem = (offset) => {
        if (len === 0) return null
        return items[(currentIndex + offset + len) % len]
    }

    const prevItem = getItem(-1)
    const centerItem = getItem(0)
    const nextItem = getItem(1)

    if (len === 0) return null

    return (
        <div className={styles.biography}>
            <div
                className={styles.background}
                style={{ backgroundImage: `url(${backgroundSrc})` }}
            />

            <div className={styles.carousel}>
                <button
                    className={styles.arrow}
                    onClick={handlePrev}
                    disabled={len < 2}
                >
                    <ArrowBackIosNewIcon />
                </button>

                <div className={styles.slots}>
                    {prevItem && len > 1 && (
                        <div
                            className={`${styles.slot} ${styles.slotSide}`}>
                            <div className={styles.backgroundSlotSide}>
                                <div className={styles.info}>
                                    <span className={styles.slotLastName}>{prevItem.lastName}</span>
                                    <span className={styles.slotFirstName}>{prevItem.firstName}</span>
                                    <span className={styles.slotSurname}>{prevItem.surname}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {centerItem && (
                        <div
                            className={`${styles.slot} ${styles.slotCenter}`}
                        >
                            <div className={styles.backgroundSlot}>
                                <div className={styles.info}>
                                    <span className={styles.slotLastName}>{centerItem.lastName}</span>
                                    <span className={styles.slotFirstName}>{centerItem.firstName}</span>
                                    <span className={styles.slotSurname}>{centerItem.surname}</span>
                                </div>
                                <button className={styles.moreBtn} onClick={() => handleClick(centerItem)}>подробнее</button>
                            </div>
                        </div>
                    )}

                    {nextItem && len > 1 && (
                        <div
                            className={`${styles.slot} ${styles.slotSide}`}>
                            <div className={styles.backgroundSlotSide}>
                                <div className={styles.info}>
                                    <span className={styles.slotLastName}>{prevItem.lastName}</span>
                                    <span className={styles.slotFirstName}>{prevItem.firstName}</span>
                                    <span className={styles.slotSurname}>{prevItem.surname}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    className={styles.arrow}
                    onClick={handleNext}
                    disabled={len < 2}
                >
                    <ArrowForwardIosIcon />
                </button>
            </div>

            <div className={styles.containerCatalogBtn}>
                <button className={styles.catalogBtn} onClick={handleClickCatalog}>перейти в каталог</button>
            </div>

            <div className={styles.containerBackBtn}>
                <button className={styles.backBtn} onClick={handleClickBack}>назад</button>

            </div>
        </div>
    )
}

export default Biography
