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

    // Определяем наличие медиа
    const hasVideo = item.video?.length > 0
    const hasPhotos = item.photos?.length > 0
    const hasAudio = item.audio?.length > 0

    // Формируем текстовые страницы: описание + история (если есть и не совпадает с описанием)
    const description = item.description || ''
    const history = item.history || ''
    const textPages = []
    if (description) textPages.push(description)
    if (history && history !== description) textPages.push(history)
    // Если нет ни description, ни history, пробуем использовать старый item.text (массив) на всякий случай
    if (textPages.length === 0 && Array.isArray(item.text)) {
        textPages.push(...item.text)
    }
    const totalTextPages = textPages.length
    const hasMultipleTextPages = totalTextPages > 1

    const [textPage, setTextPage] = useState(0)

    const prevTextPage = useCallback(() => {
        setTextPage((i) => (i > 0 ? i - 1 : i))
    }, [])

    const nextTextPage = useCallback(() => {
        setTextPage((i) => (i < totalTextPages - 1 ? i + 1 : i))
    }, [totalTextPages])

    // Формируем имя автора (скульптора/художника) для плееров
    const getCreator = () => {
        if (item.sculptors?.length) return item.sculptors.join(', ')
        if (item.artists?.length) return item.artists.join(', ')
        if (item.architects?.length) return item.architects.join(', ')
        return item.creator || 'Неизвестный автор'
    }

    // Год создания (для плееров)
    const getYear = () => item.date_opened || item.date || ''

    // Блок информации (общий для всех режимов)
    const infoBlock = (
        <aside className={styles.modalInfo}>
            <h2 className={styles.infoTitle}>{item.title}</h2>
            <div className={styles.textBlock}>
                <div className={styles.textPage}>
                    {/* Скульпторы */}
                    {item.sculptors?.length > 0 && (
                        <span className={styles.infoSculptor}>
                            <strong>Скульптор(ы):</strong> {item.sculptors.join(', ')}
                        </span>
                    )}
                    {/* Архитекторы */}
                    {item.architects?.length > 0 && (
                        <span className={styles.infoMeta}>
                            <strong>Архитектор(ы):</strong> {item.architects.join(', ')}
                        </span>
                    )}
                    {/* Художники */}
                    {item.artists?.length > 0 && (
                        <span className={styles.infoMeta}>
                            <strong>Художник(и):</strong> {item.artists.join(', ')}
                        </span>
                    )}
                    {/* Дата открытия */}
                    {item.date_opened && (
                        <span className={styles.infoMeta}>
                            <strong>Дата открытия:</strong> {item.date_opened}
                        </span>
                    )}
                    {/* Материалы */}
                    {item.materials && (
                        <span className={styles.infoMeta}>
                            <strong>Материалы:</strong> {item.materials}
                        </span>
                    )}
                    {/* Высота */}
                    {item.height && (
                        <span className={styles.infoMeta}>
                            <strong>Размеры:</strong> {item.height}
                        </span>
                    )}
                    {/* Местоположение */}
                    {item.location && (
                        <span className={styles.infoMeta}>
                            <strong>Где находится:</strong> {item.location}
                        </span>
                    )}
                    {/* Надписи (опционально) */}
                    {item.inscriptions && (
                        <span className={styles.infoMeta}>
                            <strong>Надписи:</strong> {item.inscriptions}
                        </span>
                    )}
                    {/* Тип (памятник / декоративная скульптура) */}
                    {item.type && (
                        <span className={styles.infoMeta}>
                            <strong>Тип:</strong> {item.type === 'monument' ? 'Памятник' : 'Декоративная скульптура'}
                        </span>
                    )}
                    {/* Текст (текущая страница) */}
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
                                    creator={getCreator()}
                                    year={getYear()}
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
                                        creator={getCreator()}
                                        year={getYear()}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        // Только текст (нет ни видео, ни фото)
                        <div className={styles.modalInfoFull}>
                            <h2 className={styles.infoTitle}>{item.title}</h2>
                            {item.sculptors?.length > 0 && (
                                <span className={styles.infoSculptor}>
                                    <strong>Скульптор(ы):</strong> {item.sculptors.join(', ')}
                                </span>
                            )}
                            {item.architects?.length > 0 && (
                                <span className={styles.infoMeta}>
                                    <strong>Архитектор(ы):</strong> {item.architects.join(', ')}
                                </span>
                            )}
                            {item.artists?.length > 0 && (
                                <span className={styles.infoMeta}>
                                    <strong>Художник(и):</strong> {item.artists.join(', ')}
                                </span>
                            )}
                            {item.date_opened && (
                                <span className={styles.infoMeta}>
                                    <strong>Дата открытия:</strong> {item.date_opened}
                                </span>
                            )}
                            {item.materials && (
                                <span className={styles.infoMeta}>
                                    <strong>Материалы:</strong> {item.materials}
                                </span>
                            )}
                            {item.height && (
                                <span className={styles.infoMeta}>
                                    <strong>Размеры:</strong> {item.height}
                                </span>
                            )}
                            {item.location && (
                                <span className={styles.infoMeta}>
                                    <strong>Где находится:</strong> {item.location}
                                </span>
                            )}
                            {item.inscriptions && (
                                <span className={styles.infoMeta}>
                                    <strong>Надписи:</strong> {item.inscriptions}
                                </span>
                            )}
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