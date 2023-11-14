import React, {useEffect} from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import meta from "../../Assets/Projects/meta.png";
import Cookies from "js-cookie";

function Projects(props) {
      // useEffect to set the address in a cookie when the component is mounted
  useEffect(() => {
    if (props.address) {
      Cookies.set("userAddress", props.address);
    }
  }, [props.address]);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
        Your METAMASK Account
        </h1>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={10} className="project-card">
            <img src={meta}/>
          <p>
                <b>Profile details</b>
              </p>
              <hr />
              <p>
                Address:&nbsp;
                <span className="global-message">{props.address}</span>
                <br />
                Network:&nbsp;
                <span className="global-message">{props.networkType}</span>
                <br />
                Balance:&nbsp;
                <span className="global-message">{props.balance}</span>
                &nbsp;ETH
              </p>
          </Col>

        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
