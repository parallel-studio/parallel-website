import React from 'react'

const CustomPreview = ({ value }: { value: any }) => {
  const { details, color } = value

  return (
    <div>
      <h3 style={{ color: color || 'black' }}>
        {details?.customer} - {details?.title || 'Untitled'}
      </h3>
    </div>
  )
}

export default CustomPreview
