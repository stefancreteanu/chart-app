import React from 'react';
import banner1 from '../imgs/pngtree_1.jpg'
import banner2 from '../imgs/pngtree_2.jpg'
import banner3 from '../imgs/pngtree_3.jpg'
import graph1 from '../imgs/graph_pic1.png'
import graph2 from '../imgs/graph_pic2.png'
import graph3 from '../imgs/graph_pic3.png'
import Carousel from 'react-bootstrap/Carousel'
import { useMediaPredicate } from 'react-media-hook'

const Home = () => {
    const smallerThan767 = useMediaPredicate("(max-width: 767px)")
    const biggerThan768 = useMediaPredicate("(min-width: 768px)")

    return ( 
        <div>
            <Carousel className="carousel-shadow">
                <Carousel.Item>
                    {biggerThan768 && <img
                    className="d-flex w-100 h-50"
                    src={banner1}
                    alt="slide"
                    />}
                    {smallerThan767 && <img
                    className="d-flex w-100 h-25"
                    src={banner1}
                    alt="slide"
                    />}
                    <Carousel.Caption>
                    <h3>Create your own charts</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    {biggerThan768 && <img
                    className="d-block w-100 h-50"
                    src={banner2}
                    alt="slide"
                    />}
                    {smallerThan767 && <img
                    className="d-block w-100 h-25"
                    src={banner2}
                    alt="slide"
                    />}
                    <Carousel.Caption>
                    <h3>Custom colors</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    {biggerThan768 && <img
                    className="d-block w-100 h-50"
                    src={banner3}
                    alt="slide"
                    />}
                    {smallerThan767 && <img
                    className="d-block w-100 h-25"
                    src={banner3}
                    alt="slide"
                    />}
                    <Carousel.Caption>
                    <h3>Easier than ever</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <div>
                <div className="card w-100 left">
                    <h4 className="title">Why are graphs and charts useful?</h4>
                    <div className="info">
                        {smallerThan767 && <img src={graph1} 
                        className="pic" width="400" height="400" alt="chart-pic"/>}
                        <p className="fs-55">
                            Graphs and charts condense large amounts of
                            information into easy-to-understand formats that
                            clearly and effectively communicate important points.
                        </p>
                        {biggerThan768 && <img src={graph1} 
                        className="pic" width="400" height="400" alt="chart-pic"/>}
                    </div>
                </div>
                <div className="card w-100 right">
                    <h4 className="title">What kind of graph or chart is best to use?</h4>
                    <div className="info">
                        <img src={graph2}
                        className="pic" width="400" height="400" alt="chart-pic"/>
                        <p className="fs-55">
                            Bar graphs,
                            line graphs, and pie charts are useful for displaying
                            categorical data, which is grouped into non-overlapping categories. 
                        </p>
                    </div>
                </div>
                <div className="card w-100 left">
                    <h4 className="title">How to set the chart's title?</h4>
                    <div className="info">
                        {smallerThan767 && <img src={graph3}
                        className="pic" width="400" height="400" alt="chart-pic"/>}
                        <p className="fs-55">
                        Title your graph or chart clearly to convey the purpose,
                        it provides the reader with the overall message you
                        are conveying.
                        </p>
                        {biggerThan768 && <img src={graph3}
                        className="pic" width="400" height="400" alt="chart-pic"/>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;