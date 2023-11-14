import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3>Designed and Developed by EE4032 Group 2</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3>Copyright © {year}</h3>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            <li className="social-icons">

                <AiFillGithub />
        
            </li>
            <li className="social-icons">
                <AiOutlineTwitter />
          
            </li>
            <li className="social-icons">

                <FaLinkedinIn />
              
            </li>
            <li className="social-icons">

                <AiFillInstagram />
             
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
