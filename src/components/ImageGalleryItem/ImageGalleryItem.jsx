import { memo } from 'react';
import PropTypes from 'prop-types';

import {
  ImageGalleryItemImage,
  ImageGalleryItemS,
} from 'components/MainContainerCSS';
import React from 'react';

export const ImageGalleryItem = memo(
  ({ webformatURL, tags, largeImageURL, onChange }) => {
    return (
      <ImageGalleryItemS style={{ height: '260px' }}>
        <ImageGalleryItemImage
          src={webformatURL}
          alt={tags}
          loading="lazy"
          onClick={() => {
            onChange({ largeImageURL, tags });
          }}
        />
      </ImageGalleryItemS>
    );
  }
);

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
