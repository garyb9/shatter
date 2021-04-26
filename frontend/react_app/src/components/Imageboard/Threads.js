import React, { useEffect, useCallback } from "react";
import Thread from "./Thread";
import { Container, Row, Col } from "react-bootstrap";
import ImageboardCard from "../Layouts/Card"
import { connect, useSelector, useDispatch } from "react-redux";
import { useHistory, Link, useParams } from "react-router-dom";
import { startLoading, stopLoading } from "../../store/actions/app/appActions"
import { getThreadsDispatch, getThreads } from "../../store/actions/app/appThreadActions";
import ReactLoading from "react-loading";
import Divider from '@material-ui/core/Divider';
import InfiniteScroll from "react-infinite-scroll-component";


const Threads = (props) => {
  let currCount = 0;
  const getLimit = 25;
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const { boardid } = props;

  const [loaderPadding, setLoaderPadding] = React.useState(true);
  const isLoading = useSelector((state) => { return state.app.loading;});
  const threads = useSelector((state) => { return state.app.threads;});

  useEffect(() => {
    let threadObj = {'limit': getLimit};
    if(boardid) threadObj['boardid'] = boardid;
    
    getThreadsDispatch(threadObj)(dispatch); // async GET from server

    // loader timer padding
    const timer = setTimeout(() => {    
      setLoaderPadding(false);    
    }, 1500);
    
    return (() => clearTimeout(timer));
  }, [boardid, dispatch]);

  return (
    <div>
        <Divider light style={{ marginTop: "52px" }}/> 
        <div id="scrollableDiv" style={{ height: '95vh', overflowY: "scroll", overflowX: "hidden" }}> 
        {(threads && !isLoading && !loaderPadding) 
        ? <Container fluid> 
          {Object.entries(threads).map(([key, value]) => {
            return (
              <Row key={key} className="justify-content-md-center">
                <Col md="auto">
                  <Divider light style={{ marginTop: "1px" }}/>
                    <ImageboardCard key={key} {...value}/>
                  {/* <Divider /> */}
                </Col>             
              </Row>
            );
          })}
        </Container> 
        :
        <Container fluid>  
          <Row className="justify-content-md-center" style={{ marginTop: "60px" }}>  
            <Col md="auto">
              <ReactLoading type="spin" color="#DCDCDC" />
            </Col>           
          </Row> 
        </Container>
        }
       </div>           
    </div>
  );
};

const mapStateToProps = (state) => { 
  return {
    threads: state.threads
  }
};

export default connect(mapStateToProps, null)(Threads);
