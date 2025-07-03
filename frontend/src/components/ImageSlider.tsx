import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';

const ImageSlider = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     // Предположим, вы получаете список имён файлов
    //     const fetchImageNames = async () => {
    //         const response = await fetch('http://localhost:8080/api/images/list'); // замените на ваш реальный эндпоинт
    //         const fileNames = await response.json(); // например: ["image1.jpg", "image2.jpg"]
    //
    //         const imageUrls = await Promise.all(
    //             fileNames.map(async (fileName) => {
    //                 const res = await fetch(`http://localhost:8080/api/images/${fileName}`);
    //                 const url = await res.text();
    //                 return url;
    //             })
    //         );
    //
    //         setImages(imageUrls);
    //         setLoading(false);
    //     };
    //
    //     fetchImageNames();
    // }, []);
    //
    // if (loading) return <p>Загрузка...</p>;

    return (
        <Carousel>
            {/*{images.map((url, index) => (*/}
            <Carousel.Item>
                {/*<img*/}
                {/*    className="d-block w-100"*/}
                {/*    src={url}*/}
                {/*    alt={`Slide ${index}`}*/}
                {/*    style={{ maxHeight: '500px', objectFit: 'cover' }}*/}
                {/*/>*/}
                <img src={`http://localhost:8080/api/files?cosmeticId=22&fileName=22_0.jpg`} style={{ maxHeight: '200', objectFit: 'cover' }} alt="slide"/>
            </Carousel.Item>
            <Carousel.Item>
                {/*<img*/}
                {/*    className="d-block w-100"*/}
                {/*    src={url}*/}
                {/*    alt={`Slide ${index}`}*/}
                {/*    style={{ maxHeight: '500px', objectFit: 'cover' }}*/}
                {/*/>*/}
                <img src={`http://localhost:8080/api/files?cosmeticId=22&fileName=22_1.jpg`} style={{ maxHeight: '200', objectFit: 'cover' }} alt="slide"/>
            </Carousel.Item>
            <Carousel.Item>
                {/*<img*/}
                {/*    className="d-block w-100"*/}
                {/*    src={url}*/}
                {/*    alt={`Slide ${index}`}*/}
                {/*    style={{ maxHeight: '500px', objectFit: 'cover' }}*/}
                {/*/>*/}
                <img src={`http://localhost:8080/api/files?cosmeticId=22&fileName=22_2.jpg`} style={{ maxHeight: '200', objectFit: 'cover' }} alt="slide"/>
            </Carousel.Item>
            {/*))}*/}
        </Carousel>
    );
};

export default ImageSlider;