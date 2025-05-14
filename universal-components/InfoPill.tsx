import React from 'react'

const InfoPill: React.FC<InfoPillProps> = ({ text, image }) => {
    return (
        <figure className='info-pill'>
            <img src={image} alt={text} />
            <figcaption>{text}</figcaption>
        </figure>
    )
}

export default InfoPill