import { useState, useRef, useEffect } from 'react';
import ScrollToTop from 'react-scroll-to-top';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from './Loader/Loader';
import { GlobalStyle } from './GlobalStyle';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Section } from 'components/MainContainerCSS';
import { Button } from './Button/Button';
import { fetchGetImgs, PER_PAGE } from 'utils/FetchEngine';
import { mappingArray } from 'utils/imgArrayFormatting';
import { Modal } from './Modal/Modal';

// Notification options
const toastOpts = {
  position: 'top-right',
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export const App = () => {
  const abortController = useRef(new AbortController());
  const [querry, setQuerry] = useState('');
  const [page, setPage] = useState(1);
  const [imgArr, setImgArr] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [visibleBtn, setVisibleBtn] = useState(false);
  const [status, setStatus] = useState('idle');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalImage, setModalImage] = useState({});

  useEffect(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    // console.log(page);
    // console.log(querry);

    if (querry !== '' || page !== 1) {
      setStatus('loading');
      setErrorMessage(null);
      async function getResp() {
        try {
          const resp = await fetchGetImgs(querry, page, abortController);
          console.log(resp);
          if (!resp.hits.length) {
            setStatus('idle');
            toast.warn('There nothing inside!', toastOpts);
            setVisibleBtn(false);
            return;
          }
          const fetchArr = mappingArray(resp.hits);
          if (resp.totalHits / PER_PAGE > page) {
            setVisibleBtn(true);
            if (page === 1)
              toast.success(
                `We found ${resp.totalHits} images at your request`,
                toastOpts
              );
            else
              toast.success(
                `${resp.totalHits - (page - 1) * PER_PAGE} images`,
                toastOpts
              );
          } else {
            setVisibleBtn(false);
            toast.warn(
              `last page width ${
                resp.totalHits - (page - 1) * PER_PAGE
              } images`,
              toastOpts
            );
          }
          setImgArr(prevArr => [...prevArr, ...fetchArr]);
          setStatus('idle');
        } catch (error) {
          if (error.code !== 'ERR_CANCELED') {
            setStatus('error');
            setErrorMessage('Bad request! Try reloading the page.');
          }
        }
      }
      getResp();
    }
  }, [querry, page]);

  useEffect(() => {
    if (page !== 1 && imgArr.length > PER_PAGE)
      window.scrollBy({
        top: 280 * 3,
        behavior: 'smooth',
      });
  }, [imgArr, page]);

  const handleFormQuerry = querryNew => {
    if (querryNew === '') {
      toast.error('Input your querry!', toastOpts);
      return;
    }
    if (querryNew === querry) return;
    setQuerry(querryNew);
    setPage(1);
    setImgArr([]);
  };

  const handleModalToggle = modalImage => {
    setModalImage(modalImage);
    setIsOpenModal(pState => !pState);
  };

  const newFetchImages = () => {
    setPage(page => page + 1);
  };

  return (
    <Section>
      <ScrollToTop
        smooth
        top={100}
        component={<p style={{ color: 'blue' }}>UP</p>}
      />
      <Searchbar onQuerry={handleFormQuerry} />
      <ImageGallery imgArr={imgArr} modalToggle={handleModalToggle} />
      {status === 'loading' && <Loader />}
      {status === 'error' && toast.error(errorMessage, toastOpts)}
      {visibleBtn && <Button onChange={newFetchImages} />}
      <Modal
        image={modalImage}
        isOpenState={isOpenModal}
        onChange={handleModalToggle}
      />
      <ToastContainer />
      <GlobalStyle />
    </Section>
  );
};
