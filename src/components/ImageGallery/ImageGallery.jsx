import PropTypes from 'prop-types';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { ImageGalleryS } from 'components/MainContainerCSS';

export const ImageGallery = ({ imgArr, modalToggle }) => {
  return (
    <ImageGalleryS>
      {imgArr.map(image => (
        <ImageGalleryItem
          key={image.id}
          webformatURL={image.webformatURL}
          tags={image.tags}
          largeImageURL={image.largeImageURL}
          onChange={modalToggle}
        />
      ))}
    </ImageGalleryS>
  );
};

ImageGallery.propTypes = {
  imgArr: PropTypes.arrayOf(PropTypes.object),
  modalToggle: PropTypes.func.isRequired,
};
