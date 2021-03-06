import Logo from "@assets/logos/logo-full-horizontal.svg";
import { useAppSelector } from "@hooks/store-hook";
import { selectAuthenticatedUser } from "@stores/user.store";
import styles from "@styles/menu/navbar.module.scss";
import { NavbarVariant } from "@typing/navbar-variant.enum";
import Link from "next/link";
import { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import GradeLinks from "../menu/GradeLinks";
import LessonLinks from "../menu/LessonLinks";
import UserLinks from "../menu/UserLinks";

interface Props {
  variant?: NavbarVariant;
}

const NavBar: FunctionComponent<Props> = ({ variant }) => {
  const user = useAppSelector(selectAuthenticatedUser);
  const isAuthenticated = !!user;

  // If variant isn't explicitly set, use authenticated status
  if (variant === undefined) {
    variant = isAuthenticated ? NavbarVariant.dark : NavbarVariant.light;
  }
  const bgStyle = variant === "light" ? styles.light : "";

  return (
    <Navbar
      variant={variant}
      expand="md"
      sticky="top"
      className={`${styles.navbar} ${bgStyle}`}
    >
      <Container fluid>
        <Navbar.Brand>
          <Link href={"/"} passHref>
            <a>
              <Logo height="2em" aria-label="Teatshare home" />
            </a>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 justify-content-between">
            {isAuthenticated ? (
              <>
                <hr />
                <GradeLinks />
                <hr />
                <LessonLinks className={styles.hiddenMd} />
              </>
            ) : null}
            <hr />
            <UserLinks user={user} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
