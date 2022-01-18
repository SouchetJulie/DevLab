import { FormEventHandler, FunctionComponent, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/Login.Component.module.scss";
import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { LoginRequest } from "@typing/login-request.interface";
import { useRouter } from "next/router";

interface LoginFormComponentProps {}

const LoginFormComponent: FunctionComponent<LoginFormComponentProps> = () => {
  const [validated, setValidated] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event
  ): Promise<void> => {
    setValidated(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      const formData: FormData = new FormData(form);
      const user: LoginRequest = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      if (user.email && user.password) {
        axios({
          method: "POST",
          url: "/api/user/login",
          data: user,
        })
          .then(function (response) {
            router.push("/");
          })
          .catch(function (error) {
            alert("failed");
          });
      }
    } else {
      // TODO Add alert store
    }
  };
  const handleFocus = (): void => {};
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardContainer}>
        <div className={styles.cancelIcon}>
          <Link href="/">
            <FontAwesomeIcon icon={faTimes} />
          </Link>
        </div>
        <h2>Se connecter</h2>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          action={"/api/user/login"}
          method="POST"
          className={styles.loginForm}
        >
          {/* Email */}
          <Form.Label htmlFor="email" className={styles.invisibleLabel}>
            Email :
          </Form.Label>
          <Form.Control
            className={styles.loginInput}
            id="email"
            name="email"
            placeholder="adresse email"
            type="email"
            required
          />
          {/* Password */}
          <Form.Label htmlFor="password" className={styles.invisibleLabel}>
            Mot de passe :
          </Form.Label>
          <Form.Control
            className={styles.loginInput}
            id="password"
            name="password"
            placeholder="mot de passe"
            type="password"
            required
          />

          {/* Validation */}
          <Button
            className={styles.loginButtonSend}
            type="submit"
            onFocus={handleFocus}
          >
            Valider
          </Button>

          {/* Création de compte -> Redirection */}
          <button
            className={styles.loginRedirectSignup}
            type="button"
            onFocus={handleFocus}
          >
            <Link href={"/user/signup"}>
              <a>Créer un compte</a>
            </Link>
          </button>
        </Form>
      </div>
    </div>
  );
};
export default LoginFormComponent;
