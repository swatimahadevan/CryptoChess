import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import meta from "../../Assets/Projects/meta.png";
import Cookies from "js-cookie";
import { useNavigate, Navigate } from "react-router-dom";
import './profile.css';

function Projects(props) {
  // useEffect to set the address in a cookie when the component is mounted
  useEffect(() => {
    if (props.address) {
      Cookies.set("userAddress", props.address);
    }
  }, [props.address]);

  return props.isConnected ? (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">Your METAMASK Account</h1>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={10} className="project-card">
            <div className="profile-container">
              <div className="profile-details">
                <p>
                  <span className="profile-label">Profile details</span>
                </p>
                <hr />
                <p>
                  <span className="profile-label">Address:</span>&nbsp;
                  <span className="global-message">{props.address}</span>
                  <br />
                  <span className="profile-label">Network:</span>&nbsp;
                  <span className="global-message">{props.networkType}</span>
                  <br />
                  <span className="profile-label">Balance:</span>&nbsp;
                  <span className="global-message">{props.balance}</span>
                  &nbsp;ETH
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  ) : (
    <Navigate to="/CryptoChess/Home" />
  );
}

export default Projects;
