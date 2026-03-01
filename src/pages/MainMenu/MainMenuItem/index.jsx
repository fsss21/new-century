import { useState, useCallback } from 'react'
import styles from './MainMenuItem.module.css'

import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import VideoPlayer from '../../../components/VideoPlayer/VideoPlayer'
import AudioPlayer from '../../../components/AudioPlayer/AudioPlayer'
import PhotoGallery from '../../../components/PhotoGallery/PhotoGallery'

const MainMenuItem = ({ item, onClose }) => {
    if (!item) return null

    const hasVideo = item.video?.length > 0
    const hasPhotos = item.photos?.length > 0
    const hasAudio = item.audio?.length > 0

    const textPages = Array.isArray(item.text) ? item.text : [item.text ?? '']
    const totalTextPages = textPages.length
    const hasMultipleTextPages = totalTextPages > 1

    const [textPage, setTextPage] = useState(0)

    const prevTextPage = useCallback(() => {
        setTextPage((i) => (i > 0 ? i - 1 : i))
    }, [])

    const nextTextPage = useCallback(() => {
        setTextPage((i) => (i < totalTextPages - 1 ? i + 1 : i))
    }, [totalTextPages])

    const infoBlock = (
        <aside className={styles.modalInfo}>
            <h2 className={styles.infoTitle}>{item.title}</h2>
            <div className={styles.textBlock}>
                <div className={styles.textPage}>
                    <span className={styles.infoSculptor}><strong>Статус:</strong>{item.status}</span>
                    <span className={styles.infoMeta}><strong>Значение:</strong>{item.meaning}</span>
                    <span className={styles.infoMeta}><strong>Где находится:</strong>{item.location}</span>
                    <p className={styles.infoText}>{textPages[textPage]}</p>
                </div>
                {hasMultipleTextPages && (
                    <div className={styles.textNav}>
                        <span className={styles.textNavCounter}>
                            {textPage + 1} / {totalTextPages}
                        </span>
                        <div className={styles.buttonsNav}>
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
            </div>
        </aside>
    )

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.background} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalCloseBtn} onClick={onClose}>
                    <CloseIcon />
                </button>
                <div className={`${styles.modal} ${hasPhotos && !hasVideo ? styles.modalPhoto : ''}`}>
                    {hasVideo ? (
                        <>
                            {infoBlock}
                            <div className={styles.playerWrap}>
                                <VideoPlayer
                                    src={item.video[0]}
                                    title={item.title}
                                    creator={item.creator}
                                    year={item.date}
                                />
                            </div>
                        </>
                    ) : hasPhotos ? (
                        <div className={styles.photoLayout}>
                            <div className={styles.photoTop}>
                                {infoBlock}
                                <PhotoGallery photos={item.photos} title={item.title} />
                            </div>
                            {hasAudio && (
                                <div className={styles.audioSection}>
                                    <AudioPlayer
                                        src={item.audio[0]}
                                        title={item.title}
                                        creator={item.creator}
                                        year={item.date}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.modalInfoFull}>
                            <h2 className={styles.infoTitle}>{item.title}</h2>
                            <span className={styles.infoSculptor}>{item.sculptor}</span>
                            <span className={styles.infoMeta}>{item.creation}</span>
                            <span className={styles.infoMeta}>{item.location}</span>
                            <p className={styles.infoText}>{textPages[textPage]}</p>
                            {hasMultipleTextPages && (
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
            </div>
        </div>
    )
}

export default MainMenuItem
